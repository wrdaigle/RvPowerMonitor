from datetime import datetime
import os
import sqlite3
import config
import pandas as pd
import numpy as np
import time

# databaseFile = '/home/pi/RvPowerMonitor/logger.db'
databaseFile = r'C:\Personal\RvPowerMonitor\logger.db'  # for local testing only

def createDatabase():
    if os.path.exists(databaseFile) == False:
        conn = create_connection(databaseFile)
        with conn:
            conn.execute(
                '''
                CREATE TABLE raw (
                    time INTEGER PRIMARY KEY,
                    voltage REAL,
                    watts REAL,
                    amphours REAL
                );
                '''
            )
            conn.execute('CREATE INDEX raw_idx_time ON raw (time);')
            conn.execute(
                '''
                CREATE TABLE summarized (
                    time INTEGER PRIMARY KEY,
                    voltage REAL,
                    watts REAL,
                    watts_min REAL,
                    watts_max REAL,
                    amphours REAL,
                    interval TEXT
                );
                '''
            )
            conn.execute('CREATE INDEX summarizedidx_time ON summarized (time);')
        
def summarizeData():
    conn = create_connection(databaseFile)

    sql = 'SELECT voltage, watts, amphours, time from raw'
    with conn:
        cur = conn.cursor()
        cur.execute(sql)
        rows = cur.fetchall()

    data = []
    for row in rows:
        data.append({
            'voltage':row[0],
            'watts':row[1],
            'amphours':row[2],
            'time':row[3]
        })

    interval = '60min'

    compressedData = groupDataByInterval(data, interval)

    #delete old data
    sql = 'DELETE from raw where interval is null'
    with conn:
        cur = conn.cursor()
        cur.execute(sql)
        conn.commit()
    
    # compact 
    with conn:
        cur = conn.cursor()
        cur.execute('VACUUM;')
        conn.commit()

    sql = 'INSERT INTO raw(voltage, watts, watts_min, watts_max, amphours, interval, time) VALUES '
    sqlParams = []
    for rec in compressedData:
        sql += "(?,?,?,?,?,'60',?), "
        sqlParams.append(rec['voltage'])
        sqlParams.append(rec['watts'])
        sqlParams.append(rec['watts_min'])
        sqlParams.append(rec['watts_max'])
        sqlParams.append(rec['amphours'])
        sqlParams.append(rec['time'])
    with conn:
        cur = conn.cursor()
        cur.execute(sql[0:-2]+';', sqlParams)
        conn.commit()


def getData(hours):

    sql = 'SELECT voltage, watts, amphours, time from raw where time > ? order by time'
    startTime = timeStamp() - (hours*60*60*1000)

    conn = create_connection(databaseFile)

    with conn:
        cur = conn.cursor()
        cur.execute(sql,[startTime])
        rows = cur.fetchall()

    data = []
    for row in rows:
        data.append({
            'voltage':row[0],
            'watts':row[1],
            'amphours':row[2],
            'time':row[3]
        })
    if hours<3:
        interval = '1min'
    elif hours < 7:
        interval = '5min'
    elif hours < 24:
        interval = '30min'
    elif hours < 96:
        interval = '60min'
    else:
        interval = '180min'

    graphData = groupDataByInterval(data, interval)

    return {'batteryCapacity':config.BATTERY_CAPACITY, 'graphData':graphData, 'latestData':data[-1]}

def groupDataByInterval(data,interval):
    ''' uses pandas to group data by a time interval '''
    df = pd.DataFrame(data)
    df.set_index(pd.to_datetime(df['time'],unit='ms'),inplace=True)
    
    grouped = df.resample(interval).mean()

    grouped_min = df.resample(interval).min()
    grouped_min.drop(['voltage','amphours'], axis=1,inplace=True)
    grouped_min.rename(columns={'watts':'watts_min'},inplace=True)

    grouped_max = df.resample(interval).max()
    grouped_max.drop(['voltage','amphours'], axis=1,inplace=True)
    grouped_max.rename(columns={'watts':'watts_max'},inplace=True)
    
    allDFs = pd.concat([grouped,grouped_min,grouped_max],axis=1)

    for item in ['voltage','amphours','watts','watts_min','watts_max']:
        allDFs[item] = round(allDFs[item],2)
    allDFs.dropna(inplace=True)
    allDFs['time'] = allDFs.index.astype(np.int64) / int(1e6)
    return list(allDFs.T.to_dict().values())

def getLastAmpHour():
    sql = 'SELECT amphours from raw order by time desc limit 1'
    conn = create_connection(databaseFile)
    with conn:
        cur = conn.cursor()
        cur.execute(sql)
        rows = cur.fetchall()
    if len(rows) == 0:
        return config.BATTERY_CAPACITY  #if no raw have been added, assume the battery is full
    else:
        return rows[0][0]

def create_connection(db_file):
    conn = None
    try:
        conn = sqlite3.connect(db_file)
    except Error as e:
        print(e)
    return conn
def fromTimeStamp(timestamp):
    return datetime.fromtimestamp(timestamp/1000)

def timeStamp():
    return int(1000*datetime.now().timestamp())

def add_record(voltage, watts, amphours):
    sql = ''' INSERT INTO raw(voltage, watts, amphours, time)
              VALUES(?,?,?,?) '''
    conn = create_connection(databaseFile)
    with conn:
        cur = conn.cursor()
        cur.execute(sql, [voltage, watts, amphours, timeStamp()])
        conn.commit()
        lastrowid = cur.lastrowid
    return lastrowid

 
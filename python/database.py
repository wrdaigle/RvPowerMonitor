from datetime import datetime
import sqlite3
import config
import pandas as pd
import numpy as np

databaseFile = '/home/pi/logger.db'
# databaseFile = r'C:\Personal\RvPowerMonitor\logger.db'

def getData(hours):
    sql = 'SELECT voltage, watts, amphours, time from records where time > ? order by time'
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
    graphData = list(groupDataByInterval(data, interval))
    return {'batteryCapacity':config.BATTERY_CAPACITY, 'graphData':graphData, 'latestData':data[-1]}

def groupDataByInterval(data,interval):
    ''' uses pandas to group data by a time interval '''
    df = pd.DataFrame(data)
    df.set_index(pd.to_datetime(df['time'],unit='ms'),inplace=True)
    grouped = df.resample(interval).mean()
    for item in ['voltage','amphours','watts']:
        grouped[item] = round(grouped[item],2)
    grouped.dropna(inplace=True)
    grouped['time'] = grouped.index.astype(np.int64) / int(1e6)
    return grouped.T.to_dict().values()

def getLastAmpHour():
    sql = 'SELECT amphours from records order by time desc limit 1'
    conn = create_connection(databaseFile)
    with conn:
        cur = conn.cursor()
        cur.execute(sql)
        rows = cur.fetchall()
    if len(rows) == 0:
        return config.BATTERY_CAPACITY  #if no records have been added, assume the battery is full
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

def add_record(current, voltage, watts, amphours, dod):
    sql = ''' INSERT INTO records(current, voltage, watts, amphours, dod, time)
              VALUES(?,?,?,?,?,?) '''
    conn = create_connection(databaseFile)
    with conn:
        cur = conn.cursor()
        cur.execute(sql, [current, voltage, watts, amphours, dod, timeStamp()])
        conn.commit()
        lastrowid = cur.lastrowid
    return lastrowid

 
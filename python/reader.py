from gpiozero import MCP3008
from time import sleep
from time import time
from datetime import datetime

import database
import config

supply_voltage = 5.19

sensor_current = MCP3008(channel=0, max_voltage=supply_voltage)
sensor_voltage = MCP3008(channel=1, max_voltage=supply_voltage)

def Average(lst): 
    return sum(lst) / len(lst) 

def calculateVoltage(analogValue):
    r1=4700
    r2=1000
    return supply_voltage*analogValue*(r1+r2)/r2

# create an empty database if one doesn't exist
database.createDatabase()

lastAH = database.getLastAmpHour()

while True:

    ct = time()
    
    # average the readings over 5 seconds
    voltageReadings = []
    currentReadings = []
    while (time() - ct) < 5:
        voltageReadings.append(sensor_voltage.value)
        currentReadings.append(sensor_current.value)
    averageVoltageReading = Average(voltageReadings)
    averageCurrentReading = Average(currentReadings)

    voltage = calculateVoltage(averageVoltageReading)
    current = -1*(averageCurrentReading - 0.5)*200
    watts = current*voltage

    elapseTime = time() - ct
    
    amphours = min((current*elapseTime/60/60)+lastAH,config.BATTERY_CAPACITY)
    lastAH = amphours
    dod = 100*amphours/config.BATTERY_CAPACITY

    # print('Amps:', round(current,2),'  Volts:', round(voltage,2), '  Watts', round(watts,1))

    database.add_record(round(voltage,2), round(watts,1), amphours)

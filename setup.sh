#!/bin/sh

ASK_TO_REBOOT=0

# update OS
echo '>>> Update OS Image'
sudo apt-get update
sudo apt-get -y upgrade

# install and configure PiPowerMeter
if [ ! -d "RvPowerMonitor" ]; then

    echo '>>> Installing pip3'
    sudo apt-get install python3-pip
    sudo pip3 install --upgrade setuptools
    
    echo '>>> Installing python dependencies'   
    sudo python3 flask flask_compress flask_cors pandas numpy gpiozero

    echo '>>> Installing Git'
    sudo apt-get -y install git

    echo '>>> Installing RvPowerMonitor'
    git clone https://github.com/wrdaigle/RvPowerMonitor.git RvPowerMonitor
    cd RvPowerMonitor

    echo '>>> Adding cron job to start reader after reboot'
    (sudo crontab -u root -l 2>/dev/null; echo "@reboot sudo python3 /home/pi/RvPowerMonitor/python/reader.py &") | sudo crontab -u root -

    echo '>>> Adding cron job to start api server after reboot'
    (sudo crontab -u root -l 2>/dev/null; echo "@reboot sudo python3 /home/pi/RvPowerMonitor/python/api.py &") | sudo crontab -u root -

    ASK_TO_REBOOT=1
else
    echo '>>> PiPowerMeter already installed'
fi
 
echo '>>> PiPowerMeter is installed'
if [ $ASK_TO_REBOOT -ne 0 ]; then
    echo '>>> Restarting...'
    sudo reboot
fi

exit 0
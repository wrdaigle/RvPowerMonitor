#!/bin/sh

ASK_TO_REBOOT=0

# update OS
echo '>>> Update OS Image'
sudo apt-get update
sudo apt-get -y upgrade

# install and configure RvPowerMonitor if it has not been done already
if [ ! -d "RvPowerMonitor" ]; then

    echo '>>> Installing pip3'
    sudo apt-get install python3-pip
    sudo pip3 install --upgrade setuptools
    
    echo '>>> Fixing issue with numpy library'
    sudo apt-get install libatlas-base-dev

    echo '>>> Installing python dependencies'   
    sudo pip3 install flask flask_compress flask_cors pandas numpy gpiozero RPi.GPIO spidev

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
    echo '>>> RvPowerMonitor already installed'
fi
 
echo '>>> RvPowerMonitor is installed'
if [ $ASK_TO_REBOOT -ne 0 ]; then
    echo '>>> Restarting...'
    sudo reboot
fi

exit 0
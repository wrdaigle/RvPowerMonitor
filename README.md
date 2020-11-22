# RvPowerMonitor
Raspberry Pi based battery monitor for 12v system

## Setup Raspberry Pi SD card
- Download the latest Raspberry Pi OS Lite version at https://www.raspberrypi.org/software/operating-systems/
- Use Balena Etcher (https://www.balena.io/etcher/) to burn the image to the SD card
- To enable SSH: 
  - Create an empty file at he root of the card called 'ssh'
- To connect via wifi:
  - Create a file at the root of the card called 'wpa_supplicant.conf' with the following content (updating with your own network info):
    ```
    country=US
    ctrl_interface=DIR=/var/run/wpa_supplicant GROUP=netdev
    update_config=1

    network={
        ssid="NETWORK-NAME"
        psk="NETWORK-PASSWORD"
    }
    ```
- Eject SD card from computer

## Raspberry Pi Setup
- Connect to pi via ssh
- `sudo raspi-config`
  - Change password
  - Set locale
  - Set timezone
  - Enable SPI (required for the analog to digital converter)
  - Expand file system
- `sudo reboot`
- Connect to pi via ssh
  - Install the PiPowerMeter software by running the following command (you must install with root privileges such as the built-in pi account)
    - wget -O - https://raw.githubusercontent.com/wrdaigle/RvPowerMonitor/main/setup.sh | bash
- After restart, verify that everything is working by opening a browser to Open your browser to http://<Your Raspberry Pi's IP Address>

## Turn old cell phone into kiosk
- Do a factory reset on your old phone
- Install "Fully Kiosk" from the app store. 
- I believe this is supported by both Android and Apple phones.  It works great on my Android.  I went and ahead and bought a Plus license for the advanced features. 

## Assign a static IP to the raspberry pi
Edit the network config file using the following command:
```
sudo nano /etc/dhcpcd.conf
```
Add the following to the file.  
```
interface wlan0
static ip_address=192.168.4.200
static routers=192.168.4.1
static domain_name_servers=8.8.8.8
```

## Setup up hotspot on Raspberry Pi 

See https://github.com/idev1/rpihotspot.git for details, but the TLDR is below:
```
git clone https://github.com/idev1/rpihotspot.git
cd rpihotspot
sudo chmod +x setup-network.sh
sudo ./setup-network.sh --install --ap-ssid="MyAccessPoint" --ap-password="AccessPointPW" --ap-password-encrypt --ap-country-code="US" --ap-ip-address="10.0.0.1" --wifi-interface="wlan0"
```
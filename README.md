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
- `sudo raspi-cofig`
  - Change password
  - Set locale
  - Set timezone
  - Enable SPI (required for the analog to digital converter)
  - Update
  - Expand file system
- `sudo reboot`
- Connect to pi via ssh
  - Install the PiPowerMeter software by running the following command (you must install with root privileges such as the built-in pi account)
    - wget -O https://raw.githubusercontent.com/wrdaigle/RvPowerMonitor/main/setup.sh | bash
- After restart, verify that everything is working by opening a browser to Open your browser to http://<Your Raspberry Pi's IP Address>

## Turn old cell phone into kiosk
- Do a factory reset on your old phone
- Install "Fully Kiosk" from the app store. 
- I believe this is supported by both Android and Apple phones.  It works great on my Android.  I went and ahead and bought a Plus license for the advanced features. 

## Setup up hotspot on Raspberry Pi
- Directions at https://raspap.com/
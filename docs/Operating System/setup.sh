#!/usr/bin/env bash

echo "Installing dependency packages"
sudo apt-get install curl
sudo curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash -

sudo apt-get install -y nodejs #Used in vending-app
sudo apt-get install -y build-essential #Used in vending-app
sudo apt-get install wmctrl #Used for screen management
sudo apt-get install git #Used to pull files
sudo apt-get install sqlite3 #Used in firefox addons
cd ~/Desktop
git clone https://github.com/jkubath/TouchscreenInterface

cd ~/Desktop/TouchscreenInterface/spikes/Vending\ App
cp ./vending-app ~/Desktop/TouchscreenInterface/src
cd ~/Desktop/TouchscreenInterface/src
chmod -R 777 ./vending-app

npm install

cd ~/Desktop/TouchscreenInterface/src/setup/start
./addFirefoxAddons.sh



echo "Finished"

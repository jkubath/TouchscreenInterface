#!/usr/bin/env bash

echo "Installing dependency packages"
sudo apt-get install -y curl
sudo curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash -

sudo apt-get install -y nodejs build-essential wmctrl git sqlite3

cd ~/Desktop
git clone https://github.com/jkubath/TouchscreenInterface

cd ~/Desktop/TouchscreenInterface/spikes
make deploy
cd ~/Desktop/TouchscreenInterface/src
chmod -R 777 ./vending-app

npm install

cd ~/Desktop/TouchscreenInterface/src/setup/start
./addFirefoxAddons.sh



echo "Finished"

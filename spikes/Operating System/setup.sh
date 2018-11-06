#!/usr/bin/env bash

# Root directory to download and build the application
ROOT_DIR = "~/Desktop"

echo "Installing dependency packages"
sudo apt-get install -y curl
sudo curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash -

sudo apt-get install -y nodejs build-essential wmctrl git sqlite3

# Download the git repository
cd $ROOT_DIR
git clone https://github.com/jkubath/TouchscreenInterface

# Copy the src from spikes to ./build, compile app, copy needed files to ./deploy
cd $ROOT_DIR/TouchscreenInterface
make deploy1


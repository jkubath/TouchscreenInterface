#!/bin/bash
# Dynamically set the dimension of the FireFox windows
# based on the screen size.  This is better as the value
# does not have to be hard coded for specific hardware

# xdpyinfo is a utility for displaying information about an X server.
# grep dimensions - returns the dimensions attribute
# sed -r - uses regular expressions to get the value from the dimensions attribute
# return example: 1920x1080
dims=$(xdpyinfo | grep dimensions | sed -r 's/^[^0-9]*([0-9]+x[0-9]+).*$/\1/')

# Split the returned value into x and y values
# return the number on the left side of the 'x' (1920)
x=$(cut -d 'x' -f1 <<<$dims)
# return the number on the right side of the 'x' (1080)
y=$(cut -d 'x' -f2 <<<$dims)

# Make the y value take 1/3 of the screen
let y=y/3
let yTimes2=y*2

# Set the size and location of FireFox
if [[ $(ps aux | grep "Mozilla Firefox") || $(ps aux | grep "Firefox") ]]; then
	wmctrl -r "Mozilla Firefox" -e 0,0,0,$x,$y
	wmctrl -r "Firefox" -e 0,0,0,$x,$y
else
	echo "Firefox not running"
fi

# Set the size and location of the Vending Machine/Advertisements
if [[ $(ps aux | grep "AngularElectron") ]]; then
	wmctrl -r "AngularElectron" -e 0,0,$y,$x,$yTimes2
else
	echo "Touchscreen App not running"
fi

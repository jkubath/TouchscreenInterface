#!/bin/bash
# Values are based on a touch screen with pixel size 32767 x 32767
# Set the xinput property - Coordinate Transformation Matrix
# 

echo "Script to set the Coordinate Matrix"

xinput set-prop "pointer:E&T INC. E&T IR SCREEN" "Coordinate Transformation Matrix" 0 1 0 -1 0 1 0 0 1

echo "Matrix has been set"


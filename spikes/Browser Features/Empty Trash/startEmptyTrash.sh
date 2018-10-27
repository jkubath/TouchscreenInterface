#!/bin/bash
# When startEmptyTrash is run in the Terminal, an infinite loop is run in the background,
# (due to the "&") checking for and removing anything in the Trash every 0.01 seconds.

while true
do
    rm -rf ~/.local/share/Trash/files/*
    sleep 0.01
done &

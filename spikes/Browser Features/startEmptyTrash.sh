#!/bin/sh
# When startEmptyTrash is run in the Terminal, an infinite loop is run in the background
# (due to the "&") checks for and removes anything in the Trash every 0.1 seconds.

while true; do
    rm -rf ~/.local/share/Trash/files/*
    sleep 0.1
done &

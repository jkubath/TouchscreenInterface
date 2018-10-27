#!/bin/bash
# When startWindowManager is run in the Terminal, an infinite loop is run in the background,
# (due to the "&") checking for and closing any newly opened windows.

# Store the number of windows open when the shell is started
startNumWindows=$(wmctrl -lp | awk '{ print $1 }' | wc -l)

# Enter an infinite loop
while true
do
    # Store the number of windows open at the current time
    currentNumWindows=$(wmctrl -lp | awk '{ print $1 }' | wc -l)

    # If an additional window has been opened...
    while [ $currentNumWindows -gt $startNumWindows ]
    do
	# Store how many windows there should be after one has been closed
	let currentNumWindowsMinusOne=currentNumWindows-1
	# Close the most recently opened window
        wmctrl -ic "$(wmctrl -lp | tail -1 | awk '{ print $1 }')"
	# Get the number of windows open now
        currentNumWindows=$(wmctrl -lp | awk '{ print $1 }' | wc -l)
	# While the number of windows open now is still greater than the number that should be open...
        while [ $currentNumWindows -gt $currentNumWindowsMinusOne ]
        do
		# Wait and check again until the correct number of windows are open
		sleep 0.01
		currentNumWindows=$(wmctrl -lp | awk '{ print $1 }' | wc -l)
	done
    done
    sleep 0.01
done &

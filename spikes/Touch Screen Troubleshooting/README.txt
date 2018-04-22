Touch Screen Troubleshooting Directory
	This directory holds all the spikes and testing that
	was done in order to have the touch screen work properly.

Failed - Directory
	This directory contains spikes and commands that were used
	during the troubleshooting.  In the end, these commands were
	found to not impact the touch screen functionality.

Coordinate Transformation Matrix
	This file contains the information about the property that
	is believed to control the touch screen functionality.

set_xinput_matrix.sh
	Shell script to set the Coordinate Transformation Matrix which
	will calibrate the touch screen for the user.
	This file needs execution rights.  ~$ chmod 777 set_xinput_matrix.sh

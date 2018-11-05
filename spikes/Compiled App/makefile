# Make file to run the compiled application and setup scripts

run:
	## Make sure to start firefox and run the add ins
	## then run start shell scripts and restart firefox
	(cd "setup"; make run1;)
	(./TouchscreenApp.AppImage)
	sleep 30
	(cd "setup"; make run2;)

stop:
	(cd "setup"; make stop;)

stop1:
	(cd "setup/end"; make run2;)


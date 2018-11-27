run:
	## Make sure to start firefox and run the add ins
	## then run start shell scripts and restart firefox
	(cd "setup"; make run1;)
	(cd "vending-app"; npm start &)
	sleep 30;
	(cd "setup"; make run2;)

stop:
	(cd "setup"; make stop;)

stop1:
	(cd "setup/end"; make run2;)

deploy:
	rm -d -r -f ../deploy
	mkdir ../deploy
	(cd "vending-app"; npm install;)
	(cd "vending-app"; npm run electron:linux;)
	(cd "vending-app/app-builds"; cp VendaTron-1.1.3-x86_64.AppImage ../../../deploy/TouchscreenApp.AppImage;)
	(cd "vending-app"; cp -r adverts ../../deploy;)
	(cd "vending-app"; cp -r product-data ../../deploy;)
	(cd "vending-app"; cp -r user-data ../../deploy;)
	(cd "vending-app"; cp -r products ../../deploy;)

	cp -r setup ../deploy
	cp ../spikes/Compiled\ App/makefile ../deploy
	

CC = gcc
CFlags = -Wall -pedantic -std=c11

deploy:
	(cd "App Controller"; make deploy;)
	(cd "Browser Features"; make deploy;)
	(cd "Touchscreen Calibration"; make deploy;)
	(cd "Vending App"; make deploy;)
	(cd "../src/setup/start"; chmod 777 *.sh;)
	(cd "../src/setup/end"; chmod 777 *.sh;)

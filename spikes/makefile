CC = gcc
CFlags = -Wall -pedantic -std=c11

build:
	(cd "App Controller"; make build;)
	(cd "Browser Features"; make build;)
	(cd "Touchscreen Calibration"; make build;)
	(cd "Vending App"; make build;)
	(cd "../build/setup/start"; chmod 777 *.sh;)
	(cd "../build/setup/end"; chmod 777 *.sh;)

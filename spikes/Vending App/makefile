CC = gcc
CFlags = -Wall -pedantic -std=c11

deploy:
	# remove existing vending-app folder
	rm -d -r -f ../../build/vending-app

	# Copy entire vending-app from spikes
	cp -r vending-app ../../build

	# remove the test-docs directory
	rm -d -r -f ../../build/vending-app/src/app/test-docs

	# replace electron.service.ts
	rm -f ../../build/vending-app/src/app/providers/electron.service.ts
	cp electron.service.ts ../../build/vending-app/src/app/providers

	# replace main.ts to remove dev console
	rm -f ../../build/vending-app/main.ts
	cp main.ts ../../build/vending-app

	# copy over manual
	cp Manual.txt ../../build

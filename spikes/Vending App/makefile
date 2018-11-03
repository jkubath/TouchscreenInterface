CC = gcc
CFlags = -Wall -pedantic -std=c11

deploy:
	# Copy entire vending-app from spikes
	cp -r vending-app ../../build

	# remove the test-docs directory
	rm -d -r ../../build/vending-app/src/app/test-docs

	# replace electron.service.ts
	rm ../../build/vending-app/src/app/providers/electron.service.ts
	cp electron.service.ts ../../build/vending-app/src/app/providers

	# replace main.ts to remove dev console
	rm ../../build/vending-app/main.ts
	cp main.ts ../../build/vending-app

	# copy over manual
	cp Manual.txt ../../build

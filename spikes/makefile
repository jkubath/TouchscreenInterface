CC = gcc
CFlags = -Wall -pedantic -std=c11

all:
	#${CC} ${CFlags} main/main.c rline/rline.c validate/validate.c qsolve/qsolve.c wline/wline.c foutput/foutput.c -o quadSolver -lm

deploy:
	(cd "App Controller"; make deploy;)
	(cd "Browser Features"; make deploy;)
	(cd "Touchscreen Calibration"; make deploy;)
	(cd "../src/setup/start"; chmod 777 *.sh;)
	(cd "../src/setup/end"; chmod 777 *.sh;)

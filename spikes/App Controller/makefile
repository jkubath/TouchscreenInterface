CC = gcc
CFlags = -Wall -pedantic -std=c11

all:
	#${CC} ${CFlags} main/main.c rline/rline.c validate/validate.c qsolve/qsolve.c wline/wline.c foutput/foutput.c -o quadSolver -lm

build:
	#@(cd rline; make build)
	@(cd "Browser Features"; make build;)

test:
	#@(cd foutput; make run)

#clean:
#	rm -d -rf quadSolver *.o core

deploy:
	(cd "Compiz Restrictions"; make deploy;)
	cp setWindowSizes.sh ../../src/setup/start;


cleanAll:
	#@(make clean)
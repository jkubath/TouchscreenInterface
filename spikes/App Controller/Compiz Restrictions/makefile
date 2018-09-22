CC = gcc
CFlags = -Wall -pedantic -std=c11

#all: foutputTest.o foutputTest2.o foutput.o wline.o
	#${CC} -o foutputTest foutputTest.o foutput.o wline.o

run: 
	./addCompizRestrictions.sh

end:
	./removeCompizRestrictions.sh

#build: clean foutput.o
	#cp foutput.o ../../build

deploy:
	cp addCompizRestrictions.sh ../../../src/setup/start;
	cp removeCompizRestrictions.sh ../../../src/setup/end;



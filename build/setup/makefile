CC = gcc
CFlags = -Wall -pedantic -std=c11

# all: foutputTest.o foutputTest2.o foutput.o wline.o
# 	${CC} -o foutputTest foutputTest.o foutput.o wline.o
# 	${CC} -o foutputTest2 foutputTest2.o

# run: all
# 	./foutputTest | ./foutputTest2


# build: clean foutput.o
# 	cp foutput.o ../../build

clean:
	(cd "start"; make clean;)
	(cd "end"; make clean;)

run1:
	(cd "start"; make run1;)

run2:
	(cd "start"; make run2;)

stop:
	(cd "end"; make run;)
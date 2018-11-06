CC = gcc
CFlags = -Wall -pedantic -std=c11

#all: foutputTest.o foutputTest2.o foutput.o wline.o
	#${CC} -o foutputTest foutputTest.o foutput.o wline.o

run: 
	(cd "Empty Trash"; startEmptyTrash.sh)

end:
	(cd "Empty Trash"; endEmptyTrash.sh)

#build: clean foutput.o
	#cp foutput.o ../../build

build:
	(cd "Empty Trash"; cp startEmptyTrash.sh ../../../build/setup/start;)
	(cd "Empty Trash"; cp endEmptyTrash.sh ../../../build/setup/end;)
	(cd "Firefox Addons"; cp addFirefoxAddons.sh enableFirefoxAddons.sh ../../../build/setup/start)
	(cd "Firefox Addons"; cp disableFirefoxAddons.sh ../../../build/setup/end;)
	(cd "Firefox Restrictions"; cp addFirefoxRestrictions.sh ../../../build/setup/start;)
	(cd "Firefox Restrictions"; cp removeFirefoxRestrictions.sh ../../../build/setup/end;)
	(cd "Window Manager"; cp startWindowManager.sh ../../../build/setup/start;)
	(cd "Window Manager"; cp endWindowManager.sh ../../../build/setup/end;)



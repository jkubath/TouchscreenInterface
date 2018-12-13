# Operating System
This directory holds the spikes on why the decision was made to use Ubuntu as our Operating System.


## AppImage Integration prompt
When running an AppImage, it will prompt the user to integrate the app which will make the AppImage searchable on the system.  To disable this prompt, create the file by running the commands:

	~$ mkdir ~/.local/share/appimagekit
	~$ cd ~/.local/share/appimagekit
	~$ touch no_desktopintegration

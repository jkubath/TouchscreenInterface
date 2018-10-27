## JavaScript testing

JavaScript testing was done using websites built to test pop up blocker add ins.
These are very useful as they attempt to open windows in a way that malware would
attempt to.

http://www.popuptest.com

Our implementation of the screen manager limits all firefox windows to the top 1/3 of
screen.  This means that when pop ups are opened, they are also limited to the top 1/3
of the screen.
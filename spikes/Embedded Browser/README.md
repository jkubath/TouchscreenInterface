# Embedded Browser

## Summary: 
This directory is to hold the Java applications that are spikes for
embedding a browser inside a Java application.

## EmbeddedBrowser - Directory
The Java project with code to test loading a page via the SWT package made
by Eclipse.  This package must be imported and added into the project path.

http://git.eclipse.org/c/platform/eclipse.platform.swt.git/tree/examples/org.eclipse.swt.snippets/src/org/eclipse/swt/snippets/Snippet173.java

## org.eclipse.swt
The SWT package made by Eclipse that is used in rendering a web page inside
a Java application.  This must be downloaded for the specific hardware it is
going to be run on.

http://download.eclipse.org/eclipse/downloads/drops4/R-4.7.3a-201803300640/#SWT

## WindowController - Directory
Java application that create a window and allows the user to go full screen
or minize from full screen.  This can be used to limit what the user can do
by catching the event.
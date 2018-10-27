#!/bin/bash
# When endWindowManager is run, pgrep is used to find the process ID of startWindowManager, which
# is then killed.

x=$(pgrep -f startWindowManager)
kill -KILL $x



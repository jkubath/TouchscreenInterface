#!/bin/bash
# When endEmptyTrash is run, pgrep is used to find the process ID of startEmptyTrash, which
# is then killed.

x=$(pgrep -f startEmptyTrash)
kill -KILL $x



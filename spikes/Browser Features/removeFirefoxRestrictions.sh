#!/bin/bash
# Revert the Mozilla Firefox browser to previous settings
# 

echo "Script to revert Mozilla Firefox browser to previous settings"

PROFDIR=$(cat ~/.mozilla/firefox/profiles.ini | grep 'Path=' | sed s/^Path=//)
cd ~/.mozilla/firefox/$PROFDIR

[-e user.js ] && rm user.js
touch user.js
echo "user_pref(\"browser.tabs.closeWindowWithLastTab\", true);" >> user.js
echo "user_pref(\"full-screen-api.enabled\", true);" >> user.js
echo "user_pref(\"extensions.pocket.enabled\", true);" >> user.js
echo "user_pref(\"browser.tabs.remote.separateFileUriProcess\", true);" >> user.js

[ -d chrome ] && rm -r chrome
mkdir chrome
cd chrome
touch userContent.css
touch userChrome.css



echo "Mozilla Firefox browser reverted to previous settings"

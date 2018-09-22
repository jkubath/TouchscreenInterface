#!/bin/bash
# Revert the Mozilla Firefox browser to previous settings
# 

echo "Script to revert Mozilla Firefox browser to previous settings"

PROFDIR=$(cat ~/.mozilla/firefox/profiles.ini | grep 'Path=' | sed s/^Path=//)
cd ~/.mozilla/firefox/$PROFDIR

[ -e user.js ] && rm user.js
touch user.js
echo "user_pref(\"browser.tabs.closeWindowWithLastTab\", true);" >> user.js
echo "user_pref(\"full-screen-api.enabled\", true);" >> user.js
echo "user_pref(\"extensions.pocket.enabled\", true);" >> user.js
echo "user_pref(\"browser.tabs.remote.separateFileUriProcess\", true);" >> user.js
echo "user_pref(\"browser.download.folderList\", 1);" >> user.js
echo "user_pref(\"browser.download.forbid_open_with\", false);" >> user.js
echo "user_pref(\"browser.download.dir\", \"~/Downloads\");" >> user.js
echo "user_pref(\"privacy.trackingprotection.enabled\", false);" >> user.js
echo "user_pref(\"privacy.donnottrackheader.enabled\", false);" >> user.js
echo "user_pref(\"extensions.formatautofill.addresses.enabled\", true);" >> user.js
echo "user_pref(\"signon.rememberSignons\", true);" >> user.js
echo "user_pref(\"network.cookie.cookieBehavior\", 0);" >> user.js
echo "user_pref(\"browser.urlbar.suggest.bookmark\", true);" >> user.js
echo "user_pref(\"browser.urlbar.suggest.history\", true);" >> user.js
echo "user_pref(\"browser.urlbar.suggest.searches\", true);" >> user.js
echo "user_pref(\"browser.urlbar.autocomplete.enabled\", true);" >> user.js
echo "user_pref(\"privacy.history.custom\", false);" >> user.js
echo "user_pref(\"places.history.enabled\", true);" >> user.js
echo "user_pref(\"browser.formfill.enable\", true);" >> user.js
echo "user_pref(\"browser.startup.homepage\", \"about:home\");" >> user.js
echo "user_pref(\"browser.sessionstore.resume_from_crash\", true);" >> user.js

[ -d chrome ] && rm -r chrome
mkdir chrome
cd chrome
touch userContent.css
touch userChrome.css



echo "Mozilla Firefox browser reverted to previous settings"

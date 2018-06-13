#!/bin/bash
# Enables the Addons in Firefox

# Change to the extensions directory
PROFDIR=$(cat ~/.mozilla/firefox/profiles.ini | grep 'Path=' | sed s/^Path=//)
cd ~/.mozilla/firefox/$PROFDIR

# Cause the following operations to take effect
echo "user_pref(\"extensions.pendingOperations\", true);" >> user.js

# Make some changes to extensions.json that enable Max Tabs
sed -i 's/\(.*\"defaultLocale\":{\"name\":\"Max Tabs (Web Extension)\".*\"active\":\)\(.*\)\(,\"userDisabled\".*\"locales\":\[{\"name\":\"Max Tabs (Web Extension)\".*\)/\1true\3/' extensions.json

sed -i 's/\(.*\"defaultLocale\":{\"name\":\"Max Tabs (Web Extension)\".*\"userDisabled\":\)\(.*\)\(,\"appDisabled\".*\"locales\":\[{\"name\":\"Max Tabs (Web Extension)\".*\)/\1false\3/' extensions.json

echo "Done"

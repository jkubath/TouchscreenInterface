#!/bin/bash
# Add the Addons to Firefox
#
# Summary:
# Downloads the Max Tabs Addon for Firefox from addons.mozilla.org
# Then goes through a process of finding a required name for it and renaming
# it so that it will be accepted by about:addons in Firefox
# The about:addons page and extensions.json files are then opened (required
# for the changes to take effect)
# Changes are then made to the addon that enable it
# This is followed by changes to the storage-sync.sqlite file that take the
# argument that is passed and use it in an SQL statement to change the maximum
# number of tabs that are allowed (Ex. ./addFirefoxAddons.sh 5)
# Finally, changes are made to the extensions.json file that cause the change
# of the maximum number of tabs to take effect

# Change to the extensions directory
PROFDIR=$(cat ~/.mozilla/firefox/profiles.ini | grep 'Path=' | sed s/^Path=//)
cd ~/.mozilla/firefox/$PROFDIR/extensions
rm -r *

# Download the Max Tabs .xpi file
wget "https://addons.mozilla.org/firefox/downloads/file/688364/max_tabs_web_extension-0.1.0-an+fx.xpi"

# Unzip the .xpi file, saving it in the directory "maxTabs", and remove the original .xpi file
unzip "max_tabs_web_extension-0.1.0-an+fx.xpi" -d "maxTabs"
rm "max_tabs_web_extension-0.1.0-an+fx.xpi"

# Get the required name and rename the directory
XPINAME=$(cat maxTabs/manifest.json | grep '\"id\"' | sed 's/      \"id\": \"\(.*\)\"/\1/')
mv "maxTabs" "$XPINAME"

# Move into the directory, zip it, and then remove the non-zipped directory
#  NOTE: Moving into the directory is required to zip it
cd "$XPINAME"
zip -r "../$XPINAME.xpi" *
cd ".."
rm -r "$XPINAME"
cd ".."

# Cause the following operations to take effect
sed -i 's/user_pref(\"extensions.pendingOperations\", true);//' user.js

# Open about:addons and extensions.json and leave them open for 30 seconds
#  NOTE: The 30 seconds is chosen so that the page and file are open long enough
#        for them to fully load.  This was way more than enough time for me, but
#        it is not fully guaranteed to work, so the script may need to be rerun
#        if the addon isn't sucessfully implemented
firefox "about:addons" &
sleep 30.0
killall firefox

gedit "extensions.json" &
sleep 30.0
killall gedit

# Make some changes to extensions.json that enable Max Tabs
sed -i 's/\(.*\"defaultLocale\":{\"name\":\"Max Tabs (Web Extension)\".*\"active\":\)\(.*\)\(,\"userDisabled\".*\"locales\":\[{\"name\":\"Max Tabs (Web Extension)\".*\)/\1true\3/' extensions.json

sed -i 's/\(.*\"defaultLocale\":{\"name\":\"Max Tabs (Web Extension)\".*\"userDisabled\":\)\(.*\)\(,\"appDisabled\".*\"locales\":\[{\"name\":\"Max Tabs (Web Extension)\".*\)/\1false\3/' extensions.json

# Cause the following operations to take effect
echo "user_pref(\"extensions.pendingOperations\", true);" >> user.js

# Run some SQL code that changes the maximum number of tabs to the argument passed
sqlite3 storage-sync.sqlite <<EOS
    UPDATE collection_data SET record = '{"id":"key-maxTabs","key":"maxTabs","data":"$1","_status":"created"}' WHERE 1;
EOS

# Make some more changes to extensions.json that causes the SQL code to take effect
sed -i 's/\(.*\"defaultLocale\":{\"name\":\"Max Tabs (Web Extension)\".*\"appDisabled\":\)\(.*\)\(,\"installDate\".*\"locales\":\[{\"name\":\"Max Tabs (Web Extension)\".*\)/\1true\3/' extensions.json

sed -i 's/\(.*\"defaultLocale\":{\"name\":\"Max Tabs (Web Extension)\".*\"appDisabled\":\)\(.*\)\(,\"installDate\".*\"locales\":\[{\"name\":\"Max Tabs (Web Extension)\".*\)/\1false\3/' extensions.json

echo "Done"

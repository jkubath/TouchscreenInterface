#!/bin/bash
# Set up the Mozilla Firefox browser
#
# Summary:
# Removes certain features from the Firefox browser
# also creates userContent.css and userChrome.css to
# remove move features and websites from being shown.

echo "Script to set up the Mozilla Firefox browser"

#Read the profiles.ini file, select the 'Path=' line, get the value after 'Path=' 
PROFDIR=$(cat ~/.mozilla/firefox/profiles.ini | grep 'Path=' | sed s/^Path=//)
cd ~/.mozilla/firefox/$PROFDIR

# Checks to see if the user.js file exists, then removes it
# rm -f user.js    could be used as well
[ -e user.js ] && rm user.js

# Create a new user.js file
touch user.js

# Limit features offered by the Firefox browser
# A List of features: http://kb.mozillazine.org/About:config_entries
# browser.tabs.closeWindowWithLastTab			Doesn't allow the user to close all tabs
# full-screen-api.enabled						videos cannot go fullscreen (YouTube)
# extensions.pocket.enabled						Removes the Pocket icon - ability to save pages for later
# browser.tabs.remote.seperateFileUriProcess	If only one tab is open, closing it is denied
# browser.download.folderList					Downloaded files go to the most recently used download path
# browser.download.forbid_open_with				When downloading a file, the "open with" option is removed
# browser.download.dir 							Downloaded files are saved to this directory
# browser.uiCustomization.state					Sets toolbar icon order
echo "user_pref(\"browser.tabs.closeWindowWithLastTab\", false);" >> user.js 
echo "user_pref(\"full-screen-api.enabled\", false);" >> user.js 
echo "user_pref(\"extensions.pocket.enabled\", false);" >> user.js
echo "user_pref(\"browser.tabs.remote.separateFileUriProcess\", false);" >> user.js
echo "user_pref(\"browser.download.folderList\", 2);" >> user.js
echo "user_pref(\"browser.download.forbid_open_with\", true);" >> user.js
echo "user_pref(\"browser.download.dir\", \"~/.local/share/Trash/files\");" >> user.js
echo "user_pref(\"browser.uiCustomization.state\", '{\"placements\":{\"widget-overflow-fixed-list\":[],\"PersonalToolbar\":[\"personal-bookmarks\"],\"nav-bar\":[\"back-button\",\"forward-button\",\"stop-reload-button\",\"home-button\",\"urlbar-container\"],\"TabsToolbar\":[\"tabbrowser-tabs\",\"new-tab-button\",\"alltabs-button\"],\"toolbar-menubar\":[\"menubar-items\"]},\"seen\":[\"developer-button\",\"webide-button\",\"_dd3d7613-0246-469d-bc65-2a3cc1668adc_-browser-action\"],\"dirtyAreaCache\":[\"PersonalToolbar\",\"nav-bar\",\"TabsToolbar\",\"toolbar-menubar\"],\"currentVersion\":14,\"newElementCount\":4}');" >> user.js

# Check if the chrome directory exists, them remove it
[ -d chrome ] && rm -r chrome

# Create a new chrome directory
mkdir chrome
cd chrome
touch userContent.css
touch userChrome.css

# userChrome.css rules are applied to the user interface, and can override nearly every built-in style rule
# Makes 'about:' pages display nothing
echo "@-moz-document url-prefix(about:){body, page, window {display:none !important; }}" >> userContent.css
echo "@-moz-document url(https://www.mozilla.org/credits/){body {display:none !important; }}" >> userContent.css

# userChrome.css can be used to change the way Mozilla applications' interfaces look
echo "@namespace xul url(http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul);" >> userChrome.css
# remove certain id from being shown in the browser
echo "#PanelUI-menu-button { display: none !important; }" >> userChrome.css
echo "#star-button {display: none !important; }" >> userChrome.css
echo "#pageActionButton {display: none !important; }" >> userChrome.css



echo "Mozilla Firefox browser set up"

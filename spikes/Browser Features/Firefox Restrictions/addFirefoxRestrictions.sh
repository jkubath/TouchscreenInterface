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

# Checks to see if the places.sqlite file exists, then removes it
# The places.sqlite file stores the history in Firefox
[ -e places.sqlite ] && rm places.sqlite

# Create a new user.js file
touch user.js

# Limit features offered by the Firefox browser
# A List of features: http://kb.mozillazine.org/About:config_entries
# browser.tabs.closeWindowWithLastTab			Doesn't allow the user to close all tabs
# full-screen-api.enabled						Videos cannot go fullscreen (YouTube)
# extensions.pocket.enabled						Removes the Pocket icon - ability to save pages for later
# browser.tabs.remote.separateFileUriProcess	  Prevents the user from being able to access files through file://
# browser.download.folderList					Downloaded files go to the most recently used download path
# browser.download.forbid_open_with				When downloading a file, the "open with" option is removed
# browser.download.dir 							Downloaded files are saved to this directory
# browser.uiCustomization.state					Sets toolbar icon order
# privacy.trackingprotection.enabled        Sets Tracking Protection to always block known trackers
# privacy.donottrackheader.enabled         Sets Tracking Protection to always send websites a "Do Not Track" signal
# extensions.formatautofill.addresses.enabled       Disables the autofilling of addresses in the address bar
# signon.rememberSignons        Disables remembering logins and passwords for websites
# network.cookie.cookieBehavior         Blocks cookies and site data
# browser.urlbar.suggest.bookmark       Address bar doesn't suggest bookmarks
# browser.urlbar.suggest.history        Address bar doesn't suggest browsing history
# browser.urlbar.suggest.searches       Address bar doesn't show search suggestions
# browser.urlbar.autocomplete.enabled   Address bar drop-down with suggestions doesn't appear
# privacy.history.custom        Use custom settings for history
# places.history.enabled        Browser won't remember browsing and download history
# browser.formfill.enable       Browser won't remember search and form history
# browser.startup.homepage	Sets the browser home page
# browser.sessionstore.resume_from_crash	Previous browser session can't be reloaded
echo "user_pref(\"browser.tabs.closeWindowWithLastTab\", false);" >> user.js 
echo "user_pref(\"full-screen-api.enabled\", false);" >> user.js 
echo "user_pref(\"extensions.pocket.enabled\", false);" >> user.js
echo "user_pref(\"browser.tabs.remote.separateFileUriProcess\", false);" >> user.js
echo "user_pref(\"browser.download.folderList\", 2);" >> user.js
echo "user_pref(\"browser.download.forbid_open_with\", true);" >> user.js
echo "user_pref(\"browser.download.dir\", \"~/.local/share/Trash/files\");" >> user.js
echo "user_pref(\"browser.uiCustomization.state\", '{\"placements\":{\"widget-overflow-fixed-list\":[],\"PersonalToolbar\":[\"personal-bookmarks\"],\"nav-bar\":[\"back-button\",\"forward-button\",\"stop-reload-button\",\"home-button\",\"urlbar-container\"],\"TabsToolbar\":[\"tabbrowser-tabs\",\"new-tab-button\",\"alltabs-button\"],\"toolbar-menubar\":[\"menubar-items\"]},\"seen\":[\"developer-button\",\"webide-button\",\"_dd3d7613-0246-469d-bc65-2a3cc1668adc_-browser-action\"],\"dirtyAreaCache\":[\"PersonalToolbar\",\"nav-bar\",\"TabsToolbar\",\"toolbar-menubar\"],\"currentVersion\":14,\"newElementCount\":4}');" >> user.js
echo "user_pref(\"privacy.trackingprotection.enabled\", true);" >> user.js
echo "user_pref(\"privacy.donnottrackheader.enabled\", true);" >> user.js
echo "user_pref(\"extensions.formatautofill.addresses.enabled\", false);" >> user.js
echo "user_pref(\"signon.rememberSignons\", false);" >> user.js
echo "user_pref(\"network.cookie.cookieBehavior\", 2);" >> user.js
echo "user_pref(\"browser.urlbar.suggest.bookmark\", false);" >> user.js
echo "user_pref(\"browser.urlbar.suggest.history\", false);" >> user.js
echo "user_pref(\"browser.urlbar.suggest.searches\", false);" >> user.js
echo "user_pref(\"browser.urlbar.autocomplete.enabled\", false);" >> user.js
echo "user_pref(\"privacy.history.custom\", true);" >> user.js
echo "user_pref(\"places.history.enabled\", false);" >> user.js
echo "user_pref(\"browser.formfill.enable\", false);" >> user.js
echo "user_pref(\"browser.startup.homepage\", \"https://gowmu.wmich.edu\");" >> user.js
echo "user_pref(\"browser.sessionstore.resume_from_crash\", false);" >> user.js


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
echo "#PersonalToolbar { display: block !important; }" >> userChrome.css
# Hide the context menu on toolbar, tabs, content area, and url bar
echo "#toolbar-context-menu { display: none !important; }" >> userChrome.css
echo "#tabContextMenu { display: none !important; }" >> userChrome.css
echo "#contentAreaContextMenu { display: none !important; }" >> userChrome.css
echo "#urlbar .textbox-contextmenu { display: none !important; }" >> userChrome.css



echo "Mozilla Firefox browser set up"

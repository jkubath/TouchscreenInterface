#!/bin/bash
# Set up the Mozilla Firefox browser
# 

echo "Script to set up the Mozilla Firefox browser"

PROFDIR=$(cat ~/.mozilla/firefox/profiles.ini | grep 'Path=' | sed s/^Path=//)
cd ~/.mozilla/firefox/$PROFDIR

rm user.js
touch user.js
echo "user_pref(\"browser.tabs.closeWindowWithLastTab\", false);" >> user.js
echo "user_pref(\"full-screen-api.enabled\", false);" >> user.js
echo "user_pref(\"extensions.pocket.enabled\", false);" >> user.js
echo "user_pref(\"browser.uiCustomization.state\", '{\"placements\":{\"widget-overflow-fixed-list\":[],\"PersonalToolbar\":[\"personal-bookmarks\"],\"nav-bar\":[\"back-button\",\"forward-button\",\"stop-reload-button\",\"home-button\",\"urlbar-container\"],\"TabsToolbar\":[\"tabbrowser-tabs\",\"new-tab-button\",\"alltabs-button\"],\"toolbar-menubar\":[\"menubar-items\"]},\"seen\":[\"developer-button\",\"webide-button\",\"_dd3d7613-0246-469d-bc65-2a3cc1668adc_-browser-action\"],\"dirtyAreaCache\":[\"PersonalToolbar\",\"nav-bar\",\"TabsToolbar\",\"toolbar-menubar\"],\"currentVersion\":14,\"newElementCount\":4}');" >> user.js

rm -r chrome
mkdir chrome
cd chrome
touch userContent.css
touch userChrome.css

echo "@-moz-document url-prefix(about:){body, page, window {display:none !important; }}" >> userContent.css
echo "@-moz-document url(https://www.mozilla.org/credits/){body {display:none !important; }}" >> userContent.css

echo "@namespace xul url(http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul);" >> userChrome.css
echo "#PanelUI-menu-button { display: none !important; }" >> userChrome.css
echo "#star-button {display: none !important; }" >> userChrome.css
echo "#pageActionButton {display: none !important; }" >> userChrome.css



echo "Mozilla Firefox browser set up"


### DEPRICATED: see *LimitingBrowserFeatures.txt* and *addFireFoxRestrictions.sh* & *removeFireFoxRestrictions.sh* 

~~#### Remove Unwanted menu options
1. click on the "menu options" button (3 bars)
2. select the "Customize" option
3. drag all icons off of menu / UI that are unwanted

~~#### Remove "menu options" button
1. click on the "menu options" button (3 bars)
2. select "help"
3. select "troubleshooting information"
4. under "Application Basics" click the "Open Folder" button for the "Profile Folder" row
5. In the profile directory, enter the "chrome" directory, creating one if it does not exist
6. Within the "userChrome.css" (again create if not already there) enter

```
 #PanelUI-button {
    display: none !important;
  }
  
 #PanelUI-menu-button {
    display: none !important;
  }
```

   ~~Strictly speaking, both css rules are not necessary, but using them together may help prevent the functionality breaking with future updates.

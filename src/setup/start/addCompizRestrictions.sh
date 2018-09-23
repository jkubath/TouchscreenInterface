#!/bin/bash
# Remove unity shell and add window rules
# 

echo "Script to remove unity shell and add window rules"

gsettings set org.compiz.core:/org/compiz/profiles/unity/plugins/core/ active-plugins "['core', 'composite', 'opengl', 'resize', 'compiztoolbox', 'snap', 'imgpng', 'place', 'grid', 'move', 'regex', 'scale', 'expo', 'winrules']"

gsettings set org.compiz.winrules:/org/compiz/profiles/unity/plugins/winrules/ no-move-match 'class=Firefox'
gsettings set org.compiz.winrules:/org/compiz/profiles/unity/plugins/winrules/ no-resize-match 'class=Firefox'
gsettings set org.compiz.winrules:/org/compiz/profiles/unity/plugins/winrules/ no-focus-match 'class=Firefox'
gsettings set org.compiz.winrules:/org/compiz/profiles/unity/plugins/winrules/ no-close-match 'class=Firefox'
gsettings set org.compiz.winrules:/org/compiz/profiles/unity/plugins/winrules/ no-minimize-match 'class=Firefox'
gsettings set org.compiz.winrules:/org/compiz/profiles/unity/plugins/winrules/ no-maximize-match 'class=Firefox'

echo "Unity shell removed and window rules added"

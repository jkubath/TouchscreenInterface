#!/bin/bash
# Add unity shell and remove window rules
# 

echo "Script to add unity shell and remove window rules"

gsettings set org.compiz.core:/org/compiz/profiles/unity/plugins/core/ active-plugins "['core', 'composite', 'opengl', 'resize', 'compiztoolbox', 'snap', 'imgpng', 'place', 'grid', 'move', 'regex', 'scale', 'expo', 'unityshell']"

gsettings set org.compiz.winrules:/org/compiz/profiles/unity/plugins/winrules/ no-move-match ''
gsettings set org.compiz.winrules:/org/compiz/profiles/unity/plugins/winrules/ no-resize-match ''
gsettings set org.compiz.winrules:/org/compiz/profiles/unity/plugins/winrules/ no-focus-match ''
gsettings set org.compiz.winrules:/org/compiz/profiles/unity/plugins/winrules/ no-close-match ''
gsettings set org.compiz.winrules:/org/compiz/profiles/unity/plugins/winrules/ no-minimize-match ''
gsettings set org.compiz.winrules:/org/compiz/profiles/unity/plugins/winrules/ no-maximize-match ''

echo "Unity shell added and window rules removed"

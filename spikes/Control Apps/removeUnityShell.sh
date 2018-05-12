#!/bin/bash
# Remove unity shell
# 

echo "Script to remove unity shell"

gsettings set org.compiz.core:/org/compiz/profiles/unity/plugins/core/ active-plugins "['core', 'composite', 'opengl', 'resize', 'compiztoolbox', 'snap', 'imgpng', 'place', 'grid', 'move', 'regex', 'scale', 'expo']"


echo "Unity shell removed"

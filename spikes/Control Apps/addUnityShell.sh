#!/bin/bash
# Add unity shell
# 

echo "Script to add unity shell"

gsettings set org.compiz.core:/org/compiz/profiles/unity/plugins/core/ active-plugins "['core', 'composite', 'opengl', 'resize', 'compiztoolbox', 'snap', 'imgpng', 'place', 'grid', 'move', 'regex', 'scale', 'expo', 'unityshell']"

echo "Unity shell added"

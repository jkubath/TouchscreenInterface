dims=$(xdpyinfo | grep dimensions | sed -r 's/^[^0-9]*([0-9]+x[0-9]+).*$/\1/')
x=$(cut -d 'x' -f1 <<<$dims)
y=$(cut -d 'x' -f2 <<<$dims)
let y=y/3
wmctrl -r "FireFox" -e 0,0,0,$x,$y

# dvdlikenav.js

Navigate a movie like it has a DVD menu: add buttons and point them to regions and jump to scenes on key press.

Runs in a fullscreen browser. I used this for a presentation (with touch input) and for a simple game (with a custom keyboard).

## Requirements

* A video-capable browser. Only tested in Chrome/-ium.
* A video that can be played with this browser (like h264 in a mp4 container).
* Everything (all scenes, a menu) has to be in one long movie.
* For `make-example-movie.sh`: imagemagick, ffmpeg, bash.

## Usage

* Create a `cfg.js`. See `cfg-example.js`.
  * It is basically an array of scenes
  * Each scene has a start/end-marker (in seconds).
  * Each scene can have an array of buttons
  * Each button has coordinates (expressed in fractions [0..1.0]) and a target scene
  * A 'menu' scene should probably `idleAtEnd`.
  * Note: all scenes can have buttons, like a 'back' button that targets the `start` scene.
  * Each scene can have a time window for key presses to jump to a scene, either immediately or after the current scene is finished. Use this for navigation and "quick time events".
* Copy all files to your device and open via file://. You can also run this over a network - it worked surprisingly well over WiFi with a 1GB+ movie.
* Append `#debug` to the URL to enable debug mode which visualizes borders, buttons and shows timecode and state.

## Example usage

```
sh make-example-movie.sh # should create example.mp4
cp cfg-example.js cfg.js
xdg-open ./index.html
```

* Click one of the numbers to jump into the scene.
* Scene "100" (`s100`) has a `keyWindow`. Hit (lowercase) <kbd>h</kbd> to jump to **h**ome (`start`), <kbd>n</kbd> to the **n**ext scene (`s200`). In "200" (`s200`) the jump is `delayed` and occurs at the end of the scene.

## "Autostart"

* Run this script / create a link in your OS's Autostart app / config / folder: `chromium --kiosk /path/to/dvdlikenav/index.html#isfull`
* Windows 10 notes-to-self: <kbd>Win</kbd>+<kbd>R</kbd>, `shell:startup` to open Autostart (it is very well hidden). Create a new link, target should look like `"C:\Program F…\chrome.exe" --kiosk "C:\path…\dvdlikenav\index.html#isfull"`.
* Since it's hard to reliably detect fullscreen or kiosk mode in a browser, the hash `#isfull` serves as an explicit flag.

## Video considerations

* You might notice jumps/lag/delays. I tried a version with two overlaying `<video>`s that would pre-jump and blit, but in the end a sufficiently small [GOP](https://en.wikipedia.org/wiki/Group_of_pictures) (≤5) did the trick. Strategically placed keyframes/scenecuts might do the trick even better.
* Also consider `tune=fastdecode` etc.
* Video aspect ratio has to match the display/window size, otherwise the buttons won't fit. Check with `#debug`.

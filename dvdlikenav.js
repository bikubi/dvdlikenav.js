(function (cfg, w, d, docEl, body) {
	var I, Ic,
		debug = {
			"enabled": !!d.location.hash.match(/debug/),
			"tsLog": true,
			"highlightButtons": true,
			"highlightUIBorder": true,
			"videoControls": true,
			"showKeyInput": true,
			"showSceneSelector": true
		},
		v = d.getElementsByTagName('video'),
		el = {},
		uis = {},
		currentScene = cfg.scenes.start,
		idling = false,
		keyInput = null,
		isInInputWindow = false,
		tsLog = function (str) {
			el.ts.innerHTML = currentScene.id + ' ' + str;
		},
		checkProgress = function () {
			if (idling) {
				if (debug.enabled && debug.tsLog) {
					tsLog('idling ' + (+new Date));
				}
				return;
			}
			if (debug.enabled && debug.tsLog) {
				tsLog(v[0].currentTime);
			}
			if (currentScene.keyWindow) {
				isInInputWindow = currentScene.keyWindow.start <= v[0].currentTime && v[0].currentTime < currentScene.keyWindow.end;
				if (debug.enabled && debug.showKeyInput) {
					el.key.style.opacity = isInInputWindow ? 1.0 : 0.5;
				}
			}
			else {
				isInInputWindow = null;
				if (debug.enabled && debug.showKeyInput) {
					el.key.style.opacity = 0.1;
				}
			}
			if (v[0].currentTime >= currentScene.end) {
				console.log('scene ended');
				if (currentScene.idleAtEnd === true) {
					console.log('idling until button click...')
					v[0].pause();
					idling = true;
					// idle ok
				}
				else if (typeof currentScene.after === 'string') {
					console.log('going to after: ' + currentScene.after);
					loadScene(currentScene.after);

				}
				else if (typeof currentScene.after === 'object') {
					console.log('picking next scene by input: ', keyInput, currentScene.after);
					if (currentScene.after.hasOwnProperty(keyInput)) {
						loadScene(currentScene.after[keyInput]);
					}
					else {
						console.log('no matching scene, defaulting'); 
						loadScene(currentScene.after['default']);
					}
				}
				else {
					console.log('no buttons, no after, going back to start');
					loadScene('start');
				}
			}
		},
		percentize = function (f) {
			return (f * 100) + '%';
		},
		makeUI = function (scene) {
			var sNode = d.createElement('div'), I;
			//scene.buttons.forEach(function (button) {
			for (I in scene.buttons) {
				if (!scene.buttons.hasOwnProperty(I)) continue;
				var button = scene.buttons[I],
					bNode = document.createElement('div');
				bNode.style.left   = percentize(button.x);
				bNode.style.top    = percentize(button.y);
				bNode.style.width  = percentize(button.w);
				bNode.style.height = percentize(button.h);
				bNode.dataset.targetScene = button.targetScene;
				sNode.appendChild(bNode);
			};
			return sNode;
		},
		loadScene = function (id) {
			var ui;
			console.log('loading scene', id);
			keyInput = 'default';
			if (debug.enabled && debug.showKeyInput) {
				el.key.innerHTML = keyInput;
			}
			for (I in uis) { if (!uis.hasOwnProperty(I)) continue;
				uis[I].style.display = 'none';
			};
			currentScene = cfg.scenes[id];
			if (debug.enabled && debug.showSceneSelector) {
				el.scenes.selectedIndex = currentScene.index;
			}
			idling = false;
			v[0].currentTime = currentScene.start;
			v[0].play();
			if (currentScene.buttons) {
				console.log('has buttons, popping up ui');
				if (!uis[currentScene.id]) {
					console.log('not cached yet, creating');
					uis[currentScene.id] = el.uis.appendChild(makeUI(currentScene));
				//console.log(uis);
				}
				uis[currentScene.id].style.display = 'block';
			}
		};
	console.log('debug', debug);
	if (debug.enabled) {
		if (debug.videoControls) {
			v[0].setAttribute('controls', 'true');
		}
		body.className += ' debug';
		for (I in debug) { if (!debug.hasOwnProperty(I)) continue;
			if (debug[I]) {
				body.className += ' debug-' + I;
			}
		}
	}
	['ts', 'uis', 'rfs', 'key', 'scenes'].forEach(function (id) {
		el[id] = d.getElementById(id);
	});
	Ic = 0;
	for (I in cfg.scenes) { if (!cfg.scenes.hasOwnProperty(I)) continue;
		cfg.scenes[I].id = I;
		cfg.scenes[I].index = Ic;
		Ic++;
		if (debug.enabled && debug.showSceneSelector) {
			el.scenes.innerHTML += '<option value="' + I + '">' + I + '</option>';
		}
	}
	console.log('init');
	console.log('set movieFile', cfg.movieFile);
	v[0].src = cfg.movieFile;
	//loadScene('start');
	console.log('start polling');
	/* FIXME how to reliably check for "is full screen?" doesn't seem to work...
	if (d.fullscreenElement || d.fullscreenEnabled || d.webkitFullscreenElement || d.webkitFullscreenEnabled) {
		console.log('already fullscreen, hiding button');
		el.rfs.style.display = 'none';
		loadScene('start');
	}
	else {
		console.log('listening for fullscreen button click...');
	*/
	el.rfs.addEventListener('click', function (e) {
		if (docEl.requestFullscreen) {
			console.log('fullscreen! unprefixed!');
			docEl.requestFullscreen();
		}
		else if (docEl.webkitRequestFullscreen) {
			console.log('fullscreen! webkit');
			docEl.webkitRequestFullscreen();
		}
		else {
			window.alert('Please use browser controls to switch into fullscreen mode manually');
		}
		el.rfs.style.display = 'none';
		window.setInterval(checkProgress, 10);
		loadScene('start');
	});
	el.uis.addEventListener('click', function (e) {
		if (e.target.dataset.targetScene) {
			loadScene(e.target.dataset.targetScene);
		}
	});
	w.addEventListener('keydown', function (e) {
		if (debug.enabled && debug.showKeyInput) {
			console.log(e);
		}
		if (isInInputWindow) {
			keyInput = e.key;
			if (!currentScene.keyWindow.delayed) {
				if (currentScene.after.hasOwnProperty(keyInput)) {
					loadScene(currentScene.after[keyInput]);
				}
				else {
					console.log('no matching scene, but not defaulting in immediate mode'); 
					//loadScene(currentScene.after['default']);
				}
			}
		}
		else {
			if (debug.enabled && debug.showKeyInput) {
				console.log('key ' + e.key + ' ignored, not in window');
			}
		}
		el.key.innerHTML = keyInput;
	});
	el.scenes.addEventListener('change', function (e) {
		loadScene(el.scenes.selectedOptions[0].value);
	});
})(window.Dvdnavcfg, window, document, document.documentElement, document.getElementsByTagName('body')[0]);

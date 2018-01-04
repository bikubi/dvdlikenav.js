(function (cfg, w, d, docEl, body) {
	var I,
		debug = {
			"enabled": !!d.location.hash.match(/debug/),
			"tsLog": true,
			"highlightButtons": true,
			"highlightUIBorder": true,
			"videoControls": true
		},
		v = d.getElementsByTagName('video'),
		el = {},
		uis = {},
		currentScene = cfg.scenes.start,
		idling = false,
		tsLog = function (str) {
			el.ts.innerHTML = str;
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
			if (v[0].currentTime >= currentScene.end) {
				console.log('scene ended');
				if (currentScene.idleAtEnd === true) {
					console.log('idling until button click...')
					v[0].pause();
					idling = true;
					// idle ok
				}
				else {
					console.log('no buttons, going back to start');
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
			for (I in uis) { if (!uis.hasOwnProperty(I)) continue;
				uis[I].style.display = 'none';
			};
			currentScene = cfg.scenes[id];
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
	['ts', 'uis', 'rfs'].forEach(function (id) {
		el[id] = d.getElementById(id);
	});
	for (I in cfg.scenes) { if (!cfg.scenes.hasOwnProperty(I)) continue;
		cfg.scenes[I].id = I;
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
})(window.Dvdnavcfg, window, document, document.documentElement, document.getElementsByTagName('body')[0]);

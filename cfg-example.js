window.Dvdnavcfg = {
	"movieFile": "./example.mp4",
	"scenes": {
		"start": {
			"start": 0.0,
			"end": 1.0 - 1/25,
			"idleAtEnd": true,
			"buttons": [
				{
					"x": 0.05,
					"y": 0.05,
					"w": 0.4,
					"h": 0.4,
					"targetScene": "s100"
				},
				{
					"x": 0.55,
					"y": 0.05,
					"w": 0.4,
					"h": 0.4,
					"targetScene": "s200"
				},
				{
					"x": 0.05,
					"y": 0.55,
					"w": 0.4,
					"h": 0.4,
					"targetScene": "s300"
				},
				{
					"x": 0.55,
					"y": 0.55,
					"w": 0.4,
					"h": 0.4,
					"targetScene": "s400"
				}
			]
		},
		"s100": {
			"start": 4.0,
			"end": 8.0 - 1/25,
			"keyWindow": {
				"start": 4.0,
				"end": 8.0 - 1/25,
				"delayed": false
			},
			"after": {
				"h": "start",
				"n": "s200"
			},
		},
		"s200": {
			"start": 8.0,
			"end": 11.0
		},
		"s300": {
			"start": 12.0,
			"end": 14.0
		},
		"s400": {
			"start": 16.0,
			"end": 16.5
		}

	}
};

const hallOfEmitters = {
    "name": "Sand Box 2 because one is never enough",
    "playerStartingPosition": { x: 50, y: 348 },
    "mapBackgroundColor": "#000000",
    "mapData": [
        "#############################################################################",
        "#                                                                          ##",
        "#                                                                          ##",
        "#                                                                          ##",
        "#                                                                          ##",
        "#                                                                          ##",
        "#                                                                          ##",
        "#                                                                          ##",
        "#                                                                          ##",
        "#                                                                          ##",
        "#                                                                          ##",
        "#                                                                          ##",
        "#                                                                          ##",
        "#                                                                          ##",
        "#                                                                          ##",
        "#                                                                          ##",
        "#                                                                          ##",
        "#############################################################################",
    ],
    "tiles": {        
        "#": { "type": "solid", "color": "#4B0082", "image": "./assets/metalBox.png" },                                
    },
    "particles": [
        { "name": "torch 1", "type": "fireEmitter", "x": 150, "y": 328, "color1": "#ff0000", "color2": "#ff9900", "density": 1, "count": 25, "alignment": "top", "image": "./assets/torch.png", "emissionSpeed": .5 },
        { "name": "torch 2", "type": "fireEmitter", "x": 350, "y": 328, "color1": "#ff0000", "color2": "#ff0000", "density": 2, "count": 50, "alignment": "top", "image": "./assets/torch.png", "emissionSpeed": .1 },
        { "name": "lava 1", "type": "fireEmitter", "x": 550, "y": 328, "color1": "#FF0000", "color2": "#FF0000", "density": 2, "count": 60, "alignment": "bottom", "emissionSpeed": 1 },
        { "name": "spell 1", "type": "magicSpellEmitter", "x": 750, "y": 328, "color1": "#0000FF", "color2": "#00FFFF", "density": 2, "count": 60, "emissionSpeed": 1 },

        { "name": "particle 1", "type": "particleEmitter", "x": 150, "y": 528, "color1": "#0000FF", "color2": "#00FFFF", "density": 2, "count": 60, "emissionSpeed": 1 },
        { "name": "portal 1", "type": "portalEmitter", "x": 350, "y": 500, "color1": "#00FF00", "color2": "#00FFFF", "density": 2, "count": 20, "emissionSpeed": .5 },
        { "name": "snowfall 1", "type": "snowfallEmitter", "x": 550, "y": 500, "color1": "#FFFF00", "color2": "#000FFF", "density": 2, "count": 100, "emissionSpeed": 1 },
        { "name": "waterfall 1", "type": "waterfallEmitter", "x": 750, "y": 500, "color1": "#FFFFFF", "color2": "#0000FF", "density": 1, "count": 75, "emissionSpeed": 1 },
        { "name": "waterfall 2", "type": "waterfallEmitter", "x": 755, "y": 500, "color1": "#0000FF", "color2": "#ADD8E6", "density": 1, "count": 50, "emissionSpeed": 1.5 },
    ]

};
window.hallOfEmitters = hallOfEmitters;

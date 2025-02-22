const sandBox = {
    "name": "Sand Box",
    "playerStartingPosition": { x: 800, y: 450 },
    "mapBackgroundColor": "#000000",
    "gradientTop": "#00023D",
    "gradientMiddle": "#42113E",
    "gradientBottom": "#170742",
    "mapData": [
        "#############################################################",
        "#                                                          ##",
        "#                                                          ##",
        "#                                                          ##",
        "#                                                          ##",
        "#                                                          ##",
        "#                                                          ##",
        "#                                                          ##",
        "#                                                          ##",
        "#                                                          ##",
        "#                                                          ##",
        "#                                                          ##",
        "#                                                          ##",
        "#                                                          ##",
        "#                                                          ##",
        "#                                                          ##",
        "#                                                          ##",
        "#                                                          ##",
        "#############################################################"
    ],
    "tiles": {
        "#": { "type": "solid", "color": "#4B0082", "image": "./assets/red_tile.png" }
    },
    "entities": [
        { "name": "boss", "type": "boss", "x": 220, "y": 670 }
    ],
    "particles": [
    ]

};
window.sandBox = sandBox;

const rainbowRoad = {
    "name": "Rainbow Psalce",
    "playerStartingPosition": { x: 50, y: 300 },
    "mapBackgroundColor": "#000033",
    "mapData": [
        "                                                                                  ",
        "                                                                                  ",
        "                                                                                  ",
        "            RRRRR    OOOOO    YYYYY    GGGGG    BBBBB    PPPPP    VVVVV           ",
        "                                                                                  ",
        "                                                                                  ",
        "        RRRRR    OOOOO    YYYYY    GGGGG    BBBBB    PPPPP    VVVVV               ",
        "                                                                                  ",
        "                                                                                  ",
        "    RRRRR    OOOOO    YYYYY    GGGGG    BBBBB    PPPPP    VVVVV                   ",
        "                                                                                  ",
        "                                                                                  ",
        "GGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG ",
        "BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB  ",
        "                                                                                  ",
        "                                                                                  ",
        "PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP  ",
        "VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV  "
    ],
    "tileDefinitions": {
        "R": { "type": "solid", "color": "#FF0000", "image": "./assets/red_tile.png" },
        "O": { "type": "solid", "color": "#FF7F00", "image": "./assets/orange_tile.png" },
        "Y": { "type": "solid", "color": "#FFFF00", "image": "./assets/yellow_tile.png" },
        "G": { "type": "solid", "color": "#00FF00", "image": "./assets/green_tile.png" },
        "B": { "type": "solid", "color": "#0000FF", "image": "./assets/blue_tile.png" },
        "P": { "type": "solid", "color": "#800080", "image": "./assets/purple_tile.png" },
        "V": { "type": "solid", "color": "#9400D3", "image": "./assets/violet_tile.png" },
        "@": { "type": "enemy", "color": "red", "image": "./assets/enemy1.png" },
        "$": { "type": "collectible", "color": "gold", "image": "./assets/coin.png" }
    }
};
window.rainbowRoad = rainbowRoad;

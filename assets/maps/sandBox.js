const sandBox = {
    "name": "Sand Box",
    "playerStartingPosition": { x: 1720, y: 348 },
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
        "#                   $$                     $#####   #########################",
        "#             $  ########       ######   $#######    #######PPPPPPPPPPPPP####",
        "#      $@                               #            PPPPPPPPPPPPPPPPPPPPP###",
        "#   ######    #                  @                   PPPPPPPPPPPPPPPPPPPPP###",
        "#                                ######     #################################",
        "#                                           #################################",
        "#                                           #################################",
        "#                  M     M                 ##################################",
        "#                 MGMLLLMGM   S            ##################################",
        "#############################################################################",
    ],
    "tiles": {
        "#": { "type": "solid", "color": "#4B0082", "image": "./assets/red_tile.png" },
        "M": { "type": "solid", "color": "#4B0082", "image": "./assets/metalBox.png" },
        "G": { "type": "solid", "color": "#1A1A1A" },
        "$": { "type": "collectible", "color": "yellow", "image": "./assets/coin.png" },
        "0": { "type": "loadMap", "script": "map1" },
        "L": { "type": "loadMap", "color": "#0000ff", "script": "batsAndSpings" },
        "S": { "type": "bounce", "image": "./assets/spring.png", "force": 15 },
        "0": { "type": "loadMap", "script": "map1", "width": 64, "height": 64, "image": "./assets/door.png" },
        "~": { "type": "filler", "note:": "filler for the map editor, i do nothing but show the occupied space for the door" },
        "P": { "type": "passable", "color": "#4B0082", "image": "./assets/red_tile.png" }
    }
};
window.sandBox = sandBox;

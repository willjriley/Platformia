const lavaCaverns = {
    "name": "Lava Caverns",
    "playerStartingPosition": { x: 50, y: 200 },
    "mapBackgroundColor": "#000000",
    "mapData": [
        "############################################################################################################################################",
        "#                                                                          #########                                                       #",
        "#                                                                          #########                                                       #",
        "#                                                                          #########                                                       #",
        "#                                                                          #########                                                       #",
        "#                         $                                                #########                                                       #",
        "#                        ####                                              #########                                                       #",
        "#                             #                                         0~ #########                                                       #",
        "#                                                $                      ~~ #########                                                       #",
        "#                   $$                     $#   ##   ###############################                                                       #",
        "#             $  ########       ######   $#          ###############################                                                       #",
        "#      $@                               #            PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP                                                       #",
        "#   ######    #                  @                   PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP                                                       #",
        "#                                ######     ##############################################                                                 #",
        "#                                           ###################################################                                            #",
        "#                                           ##############################################################                                 #",
        "#                  M     M                 ##############################################################################                  #",
        "#                 MGMLLLMGM   S            #################################################################################################",
        "############################################################################################################################################"
    ],
    "tileDefinitions": {
        "#": { "type": "solid", "color": "#4B0082", "image": "./assets/red_tile.png" },
        "M": { "type": "solid", "color": "#4B0082", "image": "./assets/metalBox.png" },
        "G": { "type": "solid", "color": "#1A1A1A" },
        "@": { "type": "enemy", "color": "red", "image": "./assets/enemy1.png" },
        "$": { "type": "collectible", "color": "yellow", "image": "./assets/coin.png" },
        "0": { "type": "loadMap", "script": "map1" },
        "L": { "type": "loadMap", "color": "#ff0000", "script": "coinCave" },
        "S": { "type": "bounce", "image": "./assets/spring.png", "force": 16 },
        "0": { "type": "loadMap", "script": "map1", "width": 64, "height": 64, "image": "./assets/door.png" },
        "~": { "type": "filler", "note:": "filler for the map editor, i do nothing but show the occupied space for the door" },
        "P": { "type": "passable", "color": "#4B0082", "image": "./assets/red_tile.png" }
    }
};
window.lavaCaverns = lavaCaverns;

const lavaCaverns = {
    "name": "Lava Caverns",
    "playerStartingPosition": { x: 50, y: 200 },
    "mapBackgroundColor": "#000000",
    "mapData": [
        "############################################################################################################################################",
        "#                                                                          #########                                                       #",
        "#                                                                          #########                                                       #",
        "#                                                                          #########                                                       #",
        "#             F                 F                                          #########                                                       #",
        "#                          $                 F            F       F        #########                                                       #",
        "#                        ####                                              #########                                                       #",
        "#                             #                                         0~ #########                                                       #",
        "#                                                $                      ~~ #########                                                       #",
        "#                   $$                     $#   ##   ###############################                                                       #",
        "#             $  ###R####       ######   $#          ###############################                                                       #",
        "#      $@                               #            PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP                                                       #",
        "#   ######    #                  @                   PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP                                                       #",
        "#                                ######     ##############################################                                                 #",
        "#                                           ###################################################                                            #",
        "#     F                                     ##############################################################                                 #",
        "#                  M     M                 ##############################################################################                  #",
        "#                 MGM T  GM   S            #################################################################################################",
        "#####################CCC####################################################################################################################"
    ],
    "tileDefinitions": {
        "#": { "type": "solid", "color": "#4B0082", "image": "./assets/red_tile.png" },
        "M": { "type": "solid", "color": "#4B0082", "image": "./assets/metalBox.png" },
        "G": { "type": "solid", "color": "#1A1A1A" },
        "B": { "type": "solid", "color": "#000000" },
        "C": { "type": "solid", "color": "#FF0000" },
        "@": { "type": "enemy", "color": "red", "image": "./assets/enemy1.png" },
        "$": { "type": "collectible", "color": "yellow", "image": "./assets/coin.png" },
        "0": { "type": "loadMap", "script": "map1" },
        "S": { "type": "bounce", "image": "./assets/spring.png", "force": 16 },
        "0": { "type": "loadMap", "script": "coinCave", "width": 64, "height": 64, "image": "./assets/door.png" },
        "~": { "type": "filler", "note:": "filler for the map editor, i do nothing but show the occupied space for the door" },
        "P": { "type": "passable", "color": "#4B0082", "image": "./assets/red_tile.png" },
        "R": { "type": "spinningRope", "color": "#FF0000", "image": "./assets/red_tile.png" },
        "F": { "type": "particleEmitter", "color1": "#ff0000", "color2": "#ff9900", "density": 1, "count": 25, "alignment": "top", "image": "./assets/torch.png" },
        "T": { "type": "particleEmitter", "color1": "#FF0000", "color2": "#FF0000", "density": 2, "count": 500, "alignment": "bottom" }
    }
};
window.lavaCaverns = lavaCaverns;

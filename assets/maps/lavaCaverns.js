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
        "#                          $                 F            F            F   #########                                                       #",
        "#                        ####                                              #########                                                       #",
        "#                                                                       0~ #########                                                       #",
        "#                                                 $                     ~~ #########                                                       #",
        "#                   $$                     $#   ###  ###############################                                                       #",
        "#             $  ########                $#          ###############################                                                       #",
        "#      $@                               #            PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP                                                       #",
        "#   ######    #                  @                   PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP                                                       #",
        "#                                ######     ##############################################                                                 #",
        "#                                           ###################################################                                            #",
        "#                                           ##############################################################                                 #",
        "#                  M     M                 ##############################################################################                  #",
        "#                 MGM   MGM   S            #################################################################################################",
        "#####################CCC####################################################################################################################"
    ],
    "tiles": {
        "#": { "type": "solid", "color": "#4B0082", "image": "./assets/red_tile.png" },
        "M": { "type": "solid", "color": "#4B0082", "image": "./assets/metalBox.png" },
        "G": { "type": "solid", "color": "#1A1A1A" },
        "B": { "type": "solid", "color": "#000000" },
        "C": { "type": "solid", "color": "#FF0000" },
        "$": { "type": "collectible", "color": "yellow", "image": "./assets/coin.png" },
        "S": { "type": "bounce", "image": "./assets/spring.png", "force": 14 },
        "0": { "type": "loadMap", "script": "batsAndSpings", "width": 64, "height": 64, "image": "./assets/door.png" },
        "~": { "type": "filler", "note:": "filler for the map editor, i do nothing but show the occupied space for the door" },
        "P": { "type": "passable", "color": "#4B0082", "image": "./assets/red_tile.png" }
    },
    "entities": [
        { "name": "enemy 1", "type": "enemy", "x": 200, "y": 351, "color": "red", "image": "./assets/enemy1.png", "enemyType": "patrol" },
        { "name": "enemy 2", "type": "enemy", "x": 1100, "y": 385, "color": "red", "image": "./assets/enemy1.png", "enemyType": "patrol" },
        { "name": "spinningRope 1", "type": "spinningRope", "x": 657, "y": 332, "length": 128, "color": "#FF0000" },
        { "name": "spinningRope 2", "type": "spinningRope", "x": 1554, "y": 304, "length": 128, "color": "#FF0000" }
    ],
    "particles": [
        { "name": "torch 1", "type": "particleEmitter", "x": 200, "y": 300, "color1": "#ff0000", "color2": "#ff9900", "density": 1, "count": 25, "alignment": "top", "image": "./assets/torch.png", "emissionSpeed": .5 },
        { "name": "torch 2", "type": "particleEmitter", "x": 1140, "y": 330, "color1": "#ff0000", "color2": "#ff9900", "density": 1, "count": 25, "alignment": "top", "image": "./assets/torch.png", "emissionSpeed": .5 },
        { "name": "torch 3", "type": "particleEmitter", "x": 1580, "y": 170, "color1": "#ff0000", "color2": "#ff9900", "density": 1, "count": 25, "alignment": "top", "image": "./assets/torch.png", "emissionSpeed": .5 },
        { "name": "torch 4", "type": "particleEmitter", "x": 2080, "y": 170, "color1": "#ff0000", "color2": "#ff9900", "density": 1, "count": 25, "alignment": "top", "image": "./assets/torch.png", "emissionSpeed": .5 },
        { "name": "lava 1", "type": "particleEmitter", "x": 715, "y": 560, "color1": "#FF0000", "color2": "#FF0000", "density": 2, "count": 200, "alignment": "bottom", "emissionSpeed": 1 }
    ]
};
window.lavaCaverns = lavaCaverns;

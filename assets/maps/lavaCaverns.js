const lavaCaverns = {
    "name": "Lava Caverns",
    "playerStartingPosition": { x: 50, y: 200 },
    "mapBackgroundColor": "#000000",
    "mapData": [
        "############################################################################################################################################",
        "#                                                                          #########                                                       #",
        "#                                                                          #########                                                       #",
        "#   ####                                                                   #########                                                       #",
        "#   ####                        H                                          #########                                                       #",
        "#       V         F        $                                               #########                                                       #",
        "#           H         #  ####                                              #########                                                       #",
        "#                                                                       0~ #########                                                       #",
        "#                                                 $                     ~~ #########                                                       #",
        "#                   $$                     $#   #    #################################                                                     #",
        "#             $  ########                $#          ###############################                                                       #",
        "#      $@                               #            PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP                                                       #",
        "#    ######     F                @                   PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP                                                       #",
        "#            F                   ######     ##############################################                                                 #",
        "#                                           ###################################################                                            #",
        "#           F                               ###############################################################                                #",
        "#                  M     M                 ##############################################################################                  #",
        "#                 MGM   MGM   S            #################################################################################################",
        "#####################CCC####################################################################################################################"
    ],
    "tiles": {
        "#": { "type": "solid", "color": "#4B0082", "image": "./assets/red_tile.png" },
        "F": { "type": "solid", "color": "#4B0082", "image": "./assets/red_tile.png", "moveSpeed": 5, "fallDelay": .5, "canFall": true },
        "H": { "type": "solid", "color": "#4B0082", "image": "./assets/red_tile.png", "moveDirection": "horizontal", "moveRange": 100, "moveSpeed": 1 },
        "V": { "type": "solid", "color": "#4B0082", "image": "./assets/red_tile.png", "moveDirection": "vertical", "moveRange": 159, "moveSpeed": .5 },
        "M": { "type": "solid", "color": "#4B0082", "image": "./assets/metalBox.png" },
        "G": { "type": "solid", "color": "#1A1A1A" },
        "B": { "type": "solid", "color": "#000000" },
        "C": { "type": "solid", "color": "#FF0000", "deadly": true },
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
        { "name": "spinningRope 2", "type": "spinningRope", "x": 1554, "y": 304, "length": 103, "color": "#FF0000" },
        { "name": "spikes 1", "type": "spikes", "x": 270, "y": 576, "color": "#FF4500", "height": 16, "width": 32, "riseRate": 1, "delay": 2 },
        { "name": "spikes 2", "type": "spikes", "x": 395, "y": 576, "color": "#FF4500", "height": 16, "width": 32, "riseRate": 1, "delay": 2 },
        { "name": "spikes 3", "type": "spikes", "x": 680, "y": 576, "color": "#FF4500", "height": 100, "width": 80, "riseRate": 3 },
        { "name": "spikes 4", "type": "spikes", "x": 1326, "y": 576, "color": "#FF4500", "height": 32, "width": 32, "riseRate": 3, "delay": 2 },
        { "name": "spikes 5", "type": "spikes", "x": 1420, "y": 418, "color": "#FF4500", "height": 100, "width": 256, "riseRate": 1, "delay": 4 }
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

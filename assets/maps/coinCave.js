const coinCave = {
    "name": "coinCave",
    "playerStartingPosition": { x: 50, y: 80 },
    "mapBackgroundColor": "#000000",
    "mapData": [
        "#########################################################################",
        "#                                  ##                         0~        #",
        "#                                  ##                         ~~ $      #",
        "#                                  ##                         #####     #",
        "##############################     ##                                   #",
        "#                             #    #   $$$                              #",
        "#   $                         #  $ #  $ $ $            $$               #",
        "#   $$                        #     ###########       #####             #",
        "#   $$$                          $                                      #",
        "#   $$$$$$                                                          S   #",
        "#   $$$$$$$$                     $                            ###########",
        "#        $$$$$$$                                                        #",
        "#               $$               $               S                      #",
        "#                                        ###########                    #",
        "#   S $ $ $ $      $ $ $                                                #",
        "#   ######       #########      ######       $$$$$$$$                   #",
        "#                                          $ $ $ $ $ $ $                #",
        "#    $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $                                #",
        "#########################################################################"
    ],
    "tileDefinitions": {
        "#": { "type": "solid", "color": "#4B0082", "image": "./assets/metalBox.png" },
        "@": { "type": "enemy", "color": "red", "image": "./assets/enemy1.png" },
        "$": { "type": "collectible", "color": "yellow", "image": "./assets/coin.png" },
        "S": { "type": "bounce", "image": "./assets/spring.png", "force": 15 },
        "0": { "type": "loadMap", "script": "map1", "width": 64, "height": 64, "image": "./assets/door.png" },
        "~": { "type": "filler", "note:": "filler for the map editor, i do nothing but show the occupied space for the door" }
    }
};
window.coinCave = coinCave

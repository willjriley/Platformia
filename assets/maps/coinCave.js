const coinCave = {
    "name": "coinCave",
    "playerStartingPosition": { x: 50, y: 80 },
    "mapBackgroundColor": "#000000",
    "mapData": [
        "#########################################################################",
        "#                                                                       #",
        "#                                  #                           0 $      #",
        "#                                  #                          #####     #",
        "##############################     #                                    #",
        "#                             #    #   $$$                              #",
        "#   $                         #  $ #  $$$$$            $$               #",
        "#   $$                        #  $  ###########       #####             #",
        "#   $$$                          $                                      #",
        "#   $$$$$$                       $                                  S   #",
        "#   $$$$$$$$                     $                            ###########",
        "#        $$$$$$$                 $                                      #",
        "#               $$               $               S                      #",
        "#                                $       ###########                    #",
        "#   S $$$$$$$$     $$$$$         S                                      #",
        "#   ######       #########      ######       $$$$$$$$                   #",
        "#                                          $$$$$$$$$$$$$                #",
        "#    $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$         #",
        "#########################################################################"
    ],
    "tileDefinitions": {
        "#": { "type": "solid", "color": "#4B0082", "image": "./assets/red_tile.png" },
        "@": { "type": "enemy", "color": "red", "image": "./assets/enemy1.png" },
        "$": { "type": "collectible", "color": "yellow", "image": "./assets/coin.png" },
        "S": { "type": "bounce", "color": "gray", "image": "./assets/spring.png", "force": 15 },
        "0": { "type": "loadMap", "script": "map1" }
    }
};
window.coinCave = coinCave

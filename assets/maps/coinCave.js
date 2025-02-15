const coinCave = {
    "name": "coinCave",
    "playerStartingPosition": { x: 50, y: 80 },
    "mapBackgroundColor": "#000000",
    "mapData": [
        "#########################################################################",
        "#                                                                       #",
        "#                                  #                                    #",
        "#                                  #                                    #",
        "##############################     #                                    #",
        "#                             #    #                                    #",
        "#                             #  $ #                                    #",
        "#                             #  $  ###########                         #",
        "#                                $                                      #",
        "#                                $                                      #",
        "#                                $                                      #",
        "#                                $                                      #",
        "#                                $                                      #",
        "#                                $                                      #",
        "#     $$$$$$$$     $$$$$         $                                      #",
        "#   ######       #########      ######       $$$$$$$$                   #",
        "#                                          $$$$$$$$$$$$$                #",
        "#    $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$      0  #",
        "#########################################################################"
    ],
    "tileDefinitions": {
        "#": { "type": "solid", "color": "#4B0082", "image": "./assets/red_tile.png" },
        "@": { "type": "enemy", "color": "red", "image": "./assets/enemy1.png" },
        "$": { "type": "collectible", "color": "yellow", "image": "./assets/coin.png" },
        "0": { "type": "loadMap", "script": "map1" }
    }
};
window.coinCave = coinCave

const map3 = {
    "name": "Level 3",
    "playerStartingPosition": {x: 50, y:60},
    "mapBackgroundColor": "#87CEEB",
    "mapData": [
        "!                                                                                      ",
        "!                                                                                      ",
        "!                                                                                      ",
        "!                                                                                      ",
        "!                                                                                      ",
        "!                                                                                      ",
        "!                                                                                      ",
        "!                                                                                     #",
        "!                                                                                     #",
        "!                                                                                     #",
        "!                                                                                     #",
        "!                                                                                     #",
        "!                                               0                                     #",
        "!                                            ##########                               #",
        "!                             #############################                           #",
        "!                     #########!!!!!!!!!!!!!!!!!!!!!!###########                      #",
        "!                     #                                                               #",
        "!                     #                                                               #",
        "#######################################################################################"
    ],
    "tileDefinitions": {
      "#": { "type": "solid", "color": "gray", "image": "./assets/dirt.png" },
      "!": { "type": "solid", "color": "darkgray", "image": "./assets/dirt2.png" },
      "@": { "type": "enemy", "color": "red", "image": "./assets/enemy1.png" },
      "$": { "type": "collectible", "color": "yellow", "image": "./assets/coin.png" },
      "0": { "type": "loadMap", "script": "lavaCaverns", "color": "purple" },
      "P": { "type": "passable", "color": "lightgray" }
    }
  };

window.map3 = map3;


const map3 = {
    "name": "Level 3",
    "playerStartingPosition": { x: 50, y: 60 },
    "mapBackgroundColor": "#87CEEB",
    "mapData": [
        "T                                                                                      ",
        "T                                                                                      ",
        "T                                                                                      ",
        "T                                                                                      ",
        "T                                                                                      ",
        "T                                                                                      ",
        "T                                                                                      ",
        "T                                                                                     T",
        "T                                                                                     T",
        "T                                                                                     T",
        "T                                                                                     T",
        "T                                               0~                                    T",
        "T                                               ~~                                    T",
        "T                                            ##########                               T",
        "T                             #############################                           T",
        "T                     #########!!!!!!!!!!!!!!!!!!!!!!###########                      T",
        "T                     #!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! T",
        "T                     #!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!",
        "#######################################################################################"
    ],
    "tiles": {
        "#": { "type": "solid", "color": "gray", "image": "./assets/dirt.png" },
        "!": { "type": "solid", "color": "darkgray", "image": "./assets/dirt2.png" },
        "T": { "type": "solid", "color": "transparent" },
        "$": { "type": "collectible", "color": "yellow", "image": "./assets/coin.png" },
        "P": { "type": "passable", "color": "lightgray" },
        "0": { "type": "loadMap", "script": "lavaCaverns", "color": "#000000", "width": 64, "height": 64, "image": "./assets/door.png" },
        "~": { "type": "filler", "note:": "filler for the map editor, i do nothing but show the occupied space for the door" }

    }
};

window.map3 = map3;


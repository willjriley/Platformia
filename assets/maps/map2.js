const map2 = {
    "name": "Level 2",
    "playerStartingPosition": { x: 50, y: 60 },
    "gradientTop": "#FF5733",
    "gradientMiddle": "#FFC300",
    "gradientBottom": "#C70039",
    "mapBackgroundColor": "#87CEEB",
    "music": "./assets/music/2019-12-11_-_Retro_Platforming_-_David_Fesliyan.mp3",
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
        "!                                                  ###############                    #",
        "!                                            ##########                               #",
        "!                             #############################                           #",
        "!                     #########!!!!!!!!!!!!!!!!!!!!!!###########                   0  #",
        "!                     ###ggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggg#",
        "!                     #gghh##hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh#",
        "#######################################################################################"
    ],
    "tileDefinitions": {
        "#": { "type": "solid", "color": "gray", "image": "./assets/dirt.png" },
        "!": { "type": "solid", "color": "darkgray", "image": "./assets/dirt2.png" },
        "g": { "type": "solid", "color": "#224D15" },
        "h": { "type": "solid", "color": "#11260A" },
        "@": { "type": "enemy", "color": "red", "image": "./assets/enemy1.png" },
        "$": { "type": "collectible", "color": "yellow", "image": "./assets/coin.png" },
        "0": { "type": "loadMap", "script": "map3" },
        "P": { "type": "passable", "color": "lightgray" }
    }
};

window.map2 = map2;


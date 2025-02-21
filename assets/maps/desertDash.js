const desertDash = {
    "name": "Desert Dash",
    "playerStartingPosition": { x: 50, y: 60 },
    "gradientTop": "#FF5733",
    "gradientMiddle": "#FFC300",
    "gradientBottom": "#C70039",
    "mapBackgroundColor": "#87CEEB",
    "music": "./assets/music/2019-12-11_-_Retro_Platforming_-_David_Fesliyan.mp3",
    "mapData": [
        "T                                                                                      ",
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
        "T                                         lllllllllllllll                             T",
        "T                                                                                     T",
        "T                                      jj                                             T",
        "T                                  kkkkkkkkkkk                                        T",
        "T                       ee         k        kk                                     0~ T",
        "T                     !!!!!!!!!!!!!!!!!!!!!!!!!                                    ~~ T",
        "T          cbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbd      nm T",
        "aaaighgoaaaffaaoaaaighgaahaaaighgaifaagaahffaaahaaiaoaighgaaaaaaaoaahffaaaaaaoaaaoaoaaaa"
    ],
    "tiles": {
        "a": { "type": "solid", "image": "./assets/desert/ground01.png" },
        "b": { "type": "solid", "image": "./assets/desert/ground02.png" },
        "c": { "type": "solid", "image": "./assets/desert/leftGround02.png" },
        "d": { "type": "solid", "image": "./assets/desert/rightGround02.png" },
        "e": { "type": "solid", "image": "./assets/desert/barrel.png" },
        "f": { "type": "solid", "color": "#261615", "image": "./assets/desert/filler1.png" },
        "g": { "type": "solid", "color": "#261615", "image": "./assets/desert/filler2.png" },
        "h": { "type": "solid", "color": "#261615", "image": "./assets/desert/filler3.png" },
        "i": { "type": "solid", "color": "#261615", "image": "./assets/desert/filler4.png" },
        "j": { "type": "solid", "image": "./assets/desert/crate.png" },
        "k": { "type": "solid", "image": "./assets/desert/brick01.png" },
        "l": { "type": "solid", "image": "./assets/desert/yellowDirt.png" },
        "m": { "type": "solid", "color": "#261615", "image": "./assets/desert/rightGround1.png" },
        "n": { "type": "solid", "color": "#261615", "image": "./assets/desert/leftGround1.png" },
        "o": { "type": "solid", "color": "#261615", "image": "./assets/desert/solidfiller.png" },
        "!": { "type": "solid", "color": "darkgray", "image": "./assets/dirt2.png" },
        "T": { "type": "solid", "color": "transparent" },
        "@": { "type": "enemy", "color": "red", "image": "./assets/enemy1.png" },
        "$": { "type": "collectible", "color": "yellow", "image": "./assets/coin.png" },
        "0": { "type": "loadMap", "script": "map3", "color": "#000000", "width": 64, "height": 64, "image": "./assets/door.png" },
        "~": { "type": "filler", "note:": "filler for the map editor, i do nothing but show the occupied space for the door" },
        "P": { "type": "passable", "color": "lightgray" }
    },
    "entities": [
        { "name": "spinningRope 1", "type": "spinningRope", "x": 1586, "y": 368, "length": 128, "color": "#FF0000" }
    ],
    "particles": []
};

window.desertDash = desertDash;




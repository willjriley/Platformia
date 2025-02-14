const map0 = {
    "name": "Welcome",
    "playerStartingPosition": { x: 50, y: 544 },
    "repawnPoint": { x: 50, y: 544 },
    "exit": { x: 3768, y: 544 },
    "mapBackgroundColor": "#87CEEB",
    "gradientTop": "#00023D",
    "gradientMiddle": "#42113E",
    "gradientBottom": "#170742",
    "music": "./assets/music/2020-04-24_-_Arcade_Kid_-_FesliyanStudios.com_-_David_Renda.mp3",
    "rows": 19,
    "cols": 126,
    "mapData": [
        "                                                                                                                              ",
        "                                        ^                                                                                     ",
        "           W   W  EEEEE  L      CCCCC  OOOOO  M   M  EEEEE     TTTTT  OOOOO      M   M  Y   Y     GGG   AAAAA  M   M EEEEE    ",
        "           W   W  E      L      C      O   O  MM MM  E          T    O   O      MM MM   Y Y      G   $  A   A  MM MM  E       ",
        "           W W W  EEEE   L      C      O   O  M M M  EEEE       T    O   O      M M M    Y       G  GG AAAAA  M M M  EEEE     ",
        "           W W W  E      L  @   C      O   O  M   M  E          T    O @ O      M   M    Y       G   G A   A  M   M  E   @    ",
        "            W W   EEEEE  LLLLL  CCCCC  OOOOO  M   M  EEEEE      T    OOOOO      M   M    Y        GGG  A   A  M   M  EEEEE    ",
        "                                                                                                                              ",
        "                                                                                                                              ",
        "                                                                                                                              ",
        "                                                                                                                              ",
        "                                  $$                                                                                          ",
        "                                $$$$$$                                                                                        ",
        "y                       @  $$$$$$$$$$$$$$$ @                                                                                  ",
        "r                    #############################                                                                          ##",
        "r            #########!!!!!!!!!!!!!!!!!!!!!!###########                                                                     ##",
        "r            ###ggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggg                                               00",
        "r    @    ###gghh##h##gghh##hhhhhhhhhhhhh##gghh##hhhhhhhhhhhhhhhhhh##gghh##h##gg                                            00",
        "##############################################################################################################################"
    ],
    "tileDefinitions": {
        "p": { "type": "passable", "color": "#FFFFFF" },
        "r": { "type": "solid", "color": "#FF0000", "image": "./assets/red_tile.png" },
        "y": { "type": "solid", "color": "#FF0000", "image": "./assets/yellow_tile.png" },
        "W": { "type": "solid", "color": "#FF0000" },  // Red
        "E": { "type": "solid", "color": "#FF7F00" },  // Orange
        "L": { "type": "solid", "color": "#FFFF00" },  // Yellow
        "C": { "type": "solid", "color": "#00FF00" },  // Green
        "O": { "type": "solid", "color": "#0000FF" },  // Blue
        "M": { "type": "solid", "color": "#4B0082" },  // Indigo
        "T": { "type": "solid", "color": "#9400D3" },  // Violet
        "Y": { "type": "solid", "color": "#FFC0CB" },  // Pink
        "G": { "type": "solid", "color": "#8B4513" },  // Brown
        "A": { "type": "solid", "color": "#FFD700" },  // Gold
        "#": { "type": "solid", "color": "gray", "image": "./assets/leaf.png" },
        "!": { "type": "solid", "color": "darkgray", "image": "./assets/dirt2.png" },
        "g": { "type": "solid", "color": "#224D15", "image": "./assets/dirt.png" },
        "h": { "type": "solid", "color": "#11260A" },
        "@": { "type": "enemy", "color": "red", "image": "./assets/enemy1.png" },
        "^": { "type": "enemy", "color": "red", "image": "./assets/enemy2.png" },
        "$": { "type": "collectible", "color": "yellow", "image": "./assets/coin.png" },
        "0": { "type": "loadMap", "script": "map1" }
    }
};

window.map0 = map0;

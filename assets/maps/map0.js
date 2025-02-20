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
        "                                                                                                                                   ",
        "                                               ^                                                                                   ",
        "     W   W  EEEEE  L      CCCCC  OOOOO  M   M  EEEEE     TTTTT  OOOOO     OOOOO  C   C  WWW       GGG    AAAAA  M   M  EEEEE       ",
        "     W   W  E      L      C      O   O  MM MM  E          T     O   O     O   O  C   C  W  W     G   $   A   A  MM MM  E           ",
        "     W W W  EEEE   L      C      O   O  M M M  EEEE       T     O   O     O   O  C   C  WWW      G  GG   AAAAA  M M M  EEEE        ",
        "     W W W  E      L  @   C      O   O  M   M  E  ^       T     O @ O     O   O  C   C  W  W     G   G   A   A  M   M  E   @       ",
        "      W W   EEEEE  LLLLL  CCCCC  OOOOO  M   M  EEEEE      T     OOOOO     OOOOO  CCCCC  W   W     GGG    A   A  M   M  EEEEE       ",
        "                                                                                                                                   ",
        "                                                                                                                                   ",
        "                                                                                                                                   ",
        "                                                                                                                                   ",
        "                                  $$                                                                                               ",
        "                                $$$$$$                                                                                             ",
        "y                        @ $$$$$$$$$$$$$$$ @                                                                              0~       ",
        "r                    #############################                                                                        ~~       ",
        "r            #########!!!!!!!!!!!!!!!!!!!!!!###########                                                                   rry      ",
        "r            ###ggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggg                                         #######r     ",
        "r         @###gghh##h##gghh##hhhhhhhhhhhhh##gghh##hhhhhhhhhhhhhhhhhh##gghh##h##gg                               ###########yyr     ",
        "######################################################################################################################r#y###yyrryyr"
    ],
    "tiles": {
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
        "@": { "type": "enemy", "color": "red", "image": "./assets/enemy1.png", "enemyType": "patrol" },
        "^": { "type": "enemy", "color": "red", "image": "./assets/enemy2.png", "enemyType": "hunter" },
        "$": { "type": "collectible", "color": "yellow", "width": 64, "height": 64, "image": "./assets/coin.png" },
        "0": { "type": "loadMap", "script": "map1", "width": 64, "height": 64, "image": "./assets/door.png" },
        "~": { "type": "filler", "note:": "filler for the map editor, i do nothing but show the occupied space for the door" }
    },
    "entities": [
        { "name": "enemy 1", "type": "enemy", "x": 244, "y": 543, "color": "red", "image": "./assets/enemy1.png", "enemyType": "patrol" },
        { "name": "enemy 2", "type": "enemy", "x": 756, "y": 415, "color": "red", "image": "./assets/enemy1.png", "enemyType": "patrol" },
        { "name": "enemy 3", "type": "enemy", "x": 1309, "y": 415, "color": "red", "image": "./assets/enemy1.png", "enemyType": "patrol" },
        { "name": "enemy 4", "type": "enemy", "x": 1120, "y": 160, "color": "red", "image": "./assets/enemy1.png", "enemyType": "patrol" },
        { "name": "enemy 5", "type": "enemy", "x": 1596, "y": 160, "color": "red", "image": "./assets/enemy2.png", "enemyType": "hunter" },
        { "name": "enemy 6", "type": "enemy", "x": 1511, "y": 32, "color": "red", "image": "./assets/enemy2.png", "enemyType": "hunter" }
    ],
    "particles": [
    ]
};

window.map0 = map0;

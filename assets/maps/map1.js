const map1 = {
    "name": "Level 1",
    "playerStartingPosition": { x: 50, y: 60 },
    "mapBackgroundColor": "#87CEEB",
    "gradientTop": "#001F3F",
    "gradientMiddle": "#0074D9",
    "gradientBottom": "#7FDBFF",
    "music": "./assets/music/2019-01-02_-_8_Bit_Menu_-_David_Renda_-_FesliyanStudios.com.mp3",
    "mapData": [
        "T                                                                                     T    ",
        "T                                                                                     T    ",
        "T                                              $$                                     T    ",
        "T                                  $$$$         $$                                    T    ",
        "T                            MMMMMMMMMMMM                                             T    ",
        "T                                                                                     T    ",
        "T                        MMM                                                          T    ",
        "T                                                                                     T    ",
        "T  $            $                                                                     T    ",
        "T           ########                                                                  T    ",
        "T   ####    ## $   #   S                                                              T    ",
        "T           ##   $ #   #                                                              T    ",
        "T                 $#      #                                                           T    ",
        "T  #  #####     ###                         s##########                               T    ",
        "T       $                      ###########################                            T    ",
        "T        $    #       #########!!!!!!!!!!!!!!!!!!!!!!###########                     0~    ",
        "T                    ##!!!!!!!!!!!!!!!!!!!!!!!!!!!!!################                 ~~    ",
        "T        ####       ########!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!##########         DDDDMMDDD ",
        "############################################################################################"
    ],
    "tiles": {
        "#": { "type": "solid", "color": "gray", "image": "./assets/dirt.png" },
        "!": { "type": "solid", "color": "darkgray", "image": "./assets/dirt2.png" },
        "$": { "type": "collectible", "color": "yellow", "image": "./assets/coin.png" },
        "P": { "type": "passable", "color": "lightgray" },
        "T": { "type": "solid", "color": "transparent" },
        "M": { "type": "solid", "color": "#000000" },
        "D": { "type": "solid", "color": "#1A1A1A" },
        "0": { "type": "loadMap", "script": "map2", "color": "#000000", "width": 64, "height": 64, "image": "./assets/door.png" },
        "~": { "type": "filler", "note:": "filler for the map editor, i do nothing but show the occupied space for the door" },
        "S": { "type": "bounce", "image": "./assets/spring.png", "force": 10 },
        "s": { "type": "bounce", "image": "./assets/spring.png", "force": 13 },
        "M": { "type": "solid", "color": "#4B0082", "image": "./assets/metalBox.png" }
    },
    "entities": [
        { "name": "enemy 1", "type": "enemy", "x": 182, "y": 288, "color": "red", "image": "./assets/enemy1.png", "enemyType": "patrol" },
        { "name": "enemy 2", "type": "enemy", "x": 543, "y": 543, "color": "red", "image": "./assets/enemy1.png", "enemyType": "patrol" },
        { "name": "enemy 3", "type": "enemy", "x": 1120, "y": 96, "color": "red", "image": "./assets/enemy1.png", "enemyType": "patrol" },
    ],
    "particles": [
    ]

};


window.map1 = map1;
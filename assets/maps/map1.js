const map1 = {
    "name": "Level 1",
    "playerStartingPosition": { x: 50, y: 60 },
    "mapBackgroundColor": "#87CEEB",
    "gradientTop": "#001F3F",
    "gradientMiddle": "#0074D9",
    "gradientBottom": "#7FDBFF",
    "music": "./assets/music/2019-01-02_-_8_Bit_Menu_-_David_Renda_-_FesliyanStudios.com.mp3",
    "mapData": [
        "!                                                                                     #",
        "!                                                                                     #",
        "!                                                                                     #",
        "!                                                                                     #",
        "!                                                                                     #",
        "!                                                                                     #",
        "!                                                                                     #",
        "!                                                                                     #",
        "!  $        @   $                                                                     #",
        "!           ########                                                                  #",
        "!   ####    ## $   #                                                                  #",
        "!           ##   $ #   #                                                              #",
        "!       @         $#      #                                                           #",
        "!  #  #####     ###                          ##########                               #",
        "!       $                      ###########################                            #",
        "!        $    #       #########!!!!!!!!!!!!!!!!!!!!!!###########                      #",
        "!                    ##!!!!!!!!!!!!!!!!!!!!!!!!!!!!!################                 0~",
        "!        ####    @  ########!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!##########             ~~",
        "#######################################################################################"
    ],
    "tileDefinitions": {
        "#": { "type": "solid", "color": "gray", "image": "./assets/dirt.png" },
        "!": { "type": "solid", "color": "darkgray", "image": "./assets/dirt2.png" },
        "@": { "type": "enemy", "color": "red", "image": "./assets/enemy1.png" },
        "$": { "type": "collectible", "color": "yellow", "image": "./assets/coin.png" },
        "P": { "type": "passable", "color": "lightgray" },
        "0": { "type": "loadMap", "script": "map2", "color": "darkblue", "width": 64, "height": 64, "image": "./assets/door.png" },
        "~": { "type": "filler", "note:": "filler for the map editor, i do nothing but show the occupied space for the door" }
    }
};


window.map1 = map1;
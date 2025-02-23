<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Platform Game</title>
    <style>
        body {
            margin: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            background: #0d0d0e;
        }

        canvas {
            border: 2px solid black;
            /* cursor: none; */
        }

        .map-buttons {
            position: absolute;
            right: 20px;
            top: 20px;
            display: flex;
            flex-direction: column;
            gap: 10px;
        }

        .map-buttons button {
            padding: 10px;
            font-size: 16px;
            cursor: pointer;
        }
    </style>
</head>

<body onload="selectMap('map0')">
    <div class="map-buttons">
        <button onclick="selectMap('map0', this)">Welcome</button>
        <button onclick="selectMap('map1', this)">Level 1</button>
        <button onclick="selectMap('map2', this)">Level 2</button>
        <button onclick="selectMap('map3', this)">Level 3</button>
        <button onclick="selectMap('lavaCaverns', this)">Lava Caverns</button>
        <button onclick="selectMap('batsAndSpings', this)">Bats And Spings Oh My!</button>
        <button onclick="selectMap('desertDash', this)">Desert Dash</button>        
        <button onclick="selectMap('hallOfEmitters', this)">Hall Of Emitters</button>
        <button onclick="selectMap('sandBox', this)">Sand Box</button>        
        <!-- Add more buttons as needed -->
    </div>
    <canvas id="gameCanvas" width="800" height="400"></canvas>    
    <script src="fireEmitter.js"></script>
    <script src="portalEmitter.js"></script>    
    <script src="particleEmitter.js"></script>
    <script src="waterfallEmitter.js"></script>
    <script src="snowfallEmitter.js"></script>
    <script src="magicSpellEmitter.js"></script>
    <script src="spinningRope.js"></script>
    <script src="spikes.js"></script>
    <script src="player.js"></script>
    <script src="enemy.js"></script>
    <script src="platform.js"></script>
    <script src="collectibles.js"></script>
    <script src="input.js"></script>
    <script src="mapManager.js"></script>
    <script src="tileImages.js"></script>    
    <script src="game.js"></script>

    <!-- Add more map scripts as needed -->
    <script>
        async function selectMap(mapName, button) {
            console.log(`selectMap called with mapName: ${mapName}`);
            try {
                const response = await fetch(`assets/maps/${mapName}.json`);
                if (!response.ok) {
                    throw new Error(`Failed to load map: ${mapName}`);
                }
                const mapData = await response.json();
                console.log("Map data loaded:", mapData);
                initGame(mapData);
                if (button) button.blur();                
                document.getElementById('gameCanvas').focus(); // Set focus to the canvas
            } catch (error) {
                console.error(error);
            }
        }
    </script>
 </body>
</html>

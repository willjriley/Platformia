<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Platformia</title>
    <meta http-equiv="Cache-Control" content="no-store, no-cache, must-revalidate, max-age=0">
    <meta http-equiv="Pragma" content="no-cache">
    <meta http-equiv="Expires" content="0">
    <link rel="stylesheet" href="styles.css">
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
    <script type="module">
        import FireEmitter from './emitters/FireEmitter.js';
        import PortalEmitter from './emitters/portalEmitter.js';
        import ParticleEmitter from './emitters/particleEmitter.js';
        import WaterfallEmitter from './emitters/waterfallEmitter.js';
        import SnowfallEmitter from './emitters/snowfallEmitter.js';
        import MagicSpellEmitter from './emitters/magicSpellEmitter.js';
        import SpinningRope from './entities/SpinningRope.js';
        import Spikes from './entities/Spikes.js';
        import Player from './Player.js';
        import Enemy from './entities/Enemy.js';

        /* These are assigned to window top level so that they can be accessed from
          other scripts until they have all been converted to modules */

        // Emitters
        window.FireEmitter = FireEmitter;
        window.PortalEmitter = PortalEmitter;
        window.ParticleEmitter = ParticleEmitter;
        window.WaterfallEmitter = WaterfallEmitter;
        window.SnowfallEmitter = SnowfallEmitter;
        window.MagicSpellEmitter = MagicSpellEmitter;

        // Entities
        window.SpinningRope = SpinningRope;
        window.Spikes = Spikes;

        // Player
        window.Player = Player;

        // Enemy
        window.Enemy = Enemy;

        // Platform
        // window.Platform = Platform;

        // Collectible
        // window.Collectible = Collectible;
    </script>

    <script src="platform.js"></script>
    <script src="collectibles.js"></script>
    <script src="input.js"></script>
    <script src="mapManager.js"></script>
    <script src="game.js"></script>
    <script>
        async function selectMap(mapName, button) {
            console.log(`selectMap called with mapName: ${mapName}`);
            try {
                const response = await fetch(`assets/maps/${mapName}.json`);
                if (!response.ok) {
                    throw new Error(`Failed to load map: ${mapName}`);
                }
                const mapData = await response.json();
                // console.log("Map data loaded:", mapData);
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
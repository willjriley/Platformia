let currentMusic = null;

function doPlayMusic(){    
    if (currentMusic) {
        currentMusic.play().catch(error => console.log("Audio play error:", error));
    }
}

function loadMapData(map) {
    // Reset map-related variables    
    mapData = map.mapData;
    tileDefinitions = map.tileDefinitions;
    mapBackgroundColor = map.mapBackgroundColor || "#000000";

    // Stop previous music if playing
    if (currentMusic) {
        currentMusic.pause();
        currentMusic = null;
    }

    // Play new level music if available
    if (map.music) {
        currentMusic = new Audio(map.music);
        currentMusic.loop = true;
        currentMusic.volume = 0.5; // Adjust volume as needed               
    }

    platforms = [];
    enemies = [];
    collectibles = [];

    loadTileImages();
    parseMap(mapData);

    // Set player starting position and reset velocity
    player = new Player(map.playerStartingPosition.x, map.playerStartingPosition.y);

    // Reset velocity and speed
    player.velocityX = 0;
    player.velocityY = 0;
    player.speed = 3;

    // **Reset the camera to match the new player position**
    camera.x = Math.max(0, player.x - camera.width / 2);
    camera.y = Math.max(0, player.y - camera.height / 2);

    // Stop previous game loop before starting a new one
    if (gameLoopId) {
        cancelAnimationFrame(gameLoopId);
    }

    // Start a fresh game loop
    gameLoopId = requestAnimationFrame(updateGame);
}

// Create platforms, enemies, and collectibles from the map
function parseMap(mapData) {
    // First pass: Create all platforms
    for (let y = 0; y < mapData.length; y++) {
        for (let x = 0; x < mapData[y].length; x++) {
            const char = mapData[y][x];
            const tileDef = tileDefinitions[char];
            
            if (tileDef && (tileDef.type === "solid" || tileDef.type === "loadMap")) {
                let image = tileDef.imageObj || null;
                let color = tileDef.color || null;
                // Create a platform tile
                platforms.push(
                    new Platform(
                        x * tileSize,
                        y * tileSize,
                        tileSize,
                        tileSize,
                        image,
                        tileDef.type,
                        tileDef.script || null,
                        color
                    )
                );
            }
        }
    }
    
    // Second pass: Create enemies and collectibles
    for (let y = 0; y < mapData.length; y++) {
        for (let x = 0; x < mapData[y].length; x++) {
            const char = mapData[y][x];
            const tileDef = tileDefinitions[char];
            
            if (tileDef) {
                let image = tileDef.imageObj || null;
                
                if (tileDef.type === "enemy") {
                    let enemyX = x * tileSize;
                    let enemyY = y * tileSize;
                    let platformBelow = null;
                    const tolerance = 5;  // Allow a little slack when matching positions

                    // Search through the platforms to find one directly below this enemy.
                    // We check if the enemy's bottom (enemyY + tileSize) is near a platform's top.
                    for (let platform of platforms) {
                        if (
                            enemyX + tileSize > platform.x &&        // Enemy overlaps platform horizontally
                            enemyX < platform.x + platform.width &&    // Enemy overlaps platform horizontally
                            Math.abs((enemyY + tileSize) - platform.y) <= tolerance // Enemy bottom is within tolerance of platform top
                        ) {
                            platformBelow = platform;
                            break; // Found a matching platform; no need to search further
                        }
                    }
                    
                    // Create the enemy with the found platform (or null if not found)
                    let enemy = new Enemy(enemyX, enemyY, image, platformBelow);                    
                    enemies.push(enemy);
                    
                } else if (tileDef.type === "collectible") {
                    collectibles.push(new Collectible(x * tileSize, y * tileSize, image));
                }
            }
        }
    }
}

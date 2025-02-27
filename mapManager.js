let currentMusic = null;

function doPlayMusic() {
    if (currentMusic) {
        currentMusic.play().catch(error => console.log("Audio play error:", error));
    }
}

function loadMapData(map) {
    // Reset map-related variables
    mapData = map.mapData;
    tiles = map.tileDefinitions; // Ensure tiles are populated from tileDefinitions

    mapBackgroundColor = map.mapBackgroundColor || "#000000";

    gradientTop = map.gradientTop || "";
    gradientMiddle = map.gradientMiddle || "";
    gradientBottom = map.gradientBottom || "";

    // Set useGradient to true if all three gradient values are present, otherwise false
    useGradient = gradientTop && gradientMiddle && gradientBottom ? true : false;

    // Stop previous music if playing
    if (currentMusic) {
        currentMusic.pause();
        currentMusic = null;
    }

    // Play new level music if available
    if (map.music) {
        currentMusic = new Audio(map.music);
        currentMusic.loop = true;
        currentMusic.volume = 0.1; // Adjust volume as needed
    }

    // Reset platforms, enemies, collectibles, spinning ropes, and particleEmitters
    platforms = [];
    collectibles = [];
    entitiesCollection = [];
    particleEmitters = [];

    loadTileImages();
    parseMap(mapData);
    parseEntities(map.entities);
    parseParticles(map.particles);

    // Set player starting position and reset velocity
    player = new Player(map.playerStartingPosition.x, map.playerStartingPosition.y, mapData, 32, gravity);

    // Reset velocity and speed
    player.velocityX = 0;
    player.velocityY = 0;
    player.speed = 2;

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
            const tileDef = tiles[char];

            if (tileDef && (tileDef.type === "solid" || tileDef.type === "passable" || tileDef.type === "loadMap" || tileDef.type === "bounce")) {
                let image = tileDef.imageObj || null;
                let color = tileDef.color || null;
                let width = tileDef.width || tileSize;
                let height = tileDef.height || tileSize;
                let deadly = tileDef.deadly || false;
                let moveSpeed = tileDef.moveSpeed;
                let moveDirection = tileDef.moveDirection;
                let moveRange = tileDef.moveRange;
                let fallDelay = tileDef.fallDelay;
                let canFall = tileDef.canFall || false;

                // Create a platform tile
                platforms.push(
                    new Platform(
                        x * tileSize,
                        y * tileSize,
                        width,
                        height,
                        image,
                        tileDef.type,
                        tileDef.script || null,
                        color,
                        tileDef.force || null,
                        deadly,
                        moveSpeed,
                        moveDirection,
                        moveRange,
                        fallDelay,
                        canFall
                    )
                );
            }
        }
    }

    // Second pass: Create enemies and collectibles
    for (let y = 0; y < mapData.length; y++) {
        for (let x = 0; x < mapData[y].length; x++) {
            const char = mapData[y][x];
            const tileDef = tiles[char];

            if (tileDef) {
                let image = tileDef.imageObj || null;
                let width = tileDef.width || tileSize;
                let height = tileDef.height || tileSize;

                if (tileDef.type === "enemy") {

                } else if (tileDef.type === "collectible") {
                    collectibles.push(new Collectible(x * tileSize, y * tileSize, image));
                }
            }
        }
    }
}
// Parse Entities from the map
function parseEntities(entities) {
    if (!Array.isArray(entities)) return; // Ensure entities is an array
    entities.forEach(entity => {
        if (entity.type === "spinningRope") {
            entitiesCollection.push(new SpinningRope(entity.x, entity.y, entity.length, entity.color, entity.image, entity.spinRate));
        } else if (entity.type === "spikes") {
            entitiesCollection.push(new Spikes(entity.x, entity.y, entity.width, entity.height, entity.color, entity.riseRate, entity.delay));
        } else if (entity.type === "enemy") {
            let platformBelow = null;
            const tolerance = 5;  // Allow a little slack when matching positions

            // Search through the platforms to find one directly below this enemy.
            for (let platform of platforms) {
                if (
                    entity.x + entity.width > platform.x &&        // Enemy overlaps platform horizontally
                    entity.x < platform.x + platform.width &&    // Enemy overlaps platform horizontally
                    Math.abs((entity.y + entity.height) - platform.y) <= tolerance // Enemy bottom is within tolerance of platform top
                ) {
                    platformBelow = platform;
                    break; // Found a matching platform; no need to search further
                }
            }

            // Ensure the image is loaded before creating the enemy
            const image = new Image();
            image.src = entity.image;
            image.onload = () => {
                // Create the enemy with the found platform (or null if not found)
                let enemy = new Enemy(entity.x, entity.y, image, platformBelow, entity.enemyType, entity.width, entity.height);
                entitiesCollection.push(enemy);
            };
        }
    });
}
// Parse particles from the map
function parseParticles(particles) {
    if (!Array.isArray(particles)) return; // Ensure particles is an array
    particles.forEach(particle => {
        if (particle.type === "particleEmitter") {
            particleEmitters.push(new ParticleEmitter(particle.x, particle.y, particle.color1, particle.color2, particle.density, particle.count, particle.image, particle.alignment, particle.emissionSpeed));
        }
        if (particle.type === "fireEmitter") {
            particleEmitters.push(new FireEmitter(particle.x, particle.y, particle.color1, particle.color2, particle.density, particle.count, particle.image, particle.alignment, particle.emissionSpeed));
        }
        if (particle.type === "waterfallEmitter") {
            particleEmitters.push(new WaterfallEmitter(particle.x, particle.y, particle.color1, particle.color2, particle.density, particle.count, particle.emissionSpeed));
        }
        if (particle.type === "snowfallEmitter") {
            particleEmitters.push(new SnowfallEmitter(particle.x, particle.y, particle.color1, particle.color2, particle.density, particle.count, particle.emissionSpeed));
        }
        if (particle.type === "magicSpellEmitter") {
            particleEmitters.push(new MagicSpellEmitter(particle.x, particle.y, particle.color1, particle.color2, particle.density, particle.count, particle.emissionSpeed));
        }
        if (particle.type === "portalEmitter") {
            particleEmitters.push(new PortalEmitter(particle.x, particle.y, particle.color1, particle.color2, particle.density, particle.count, particle.emissionSpeed));
        }
    });
}

function loadTileImages() {
    for (let key in tiles) {
        if (tiles[key].image) {
            let image = new Image();
            image.src = tiles[key].image;
            tiles[key].imageObj = image;
        }
    }
}

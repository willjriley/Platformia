import Player from './entities/Player.js';
import Platform from './entities/Platform.js';
import Enemy from './entities/Enemy.js';
import Collectible from './entities/Collectible.js';
import SpinningRope from './entities/SpinningRope.js';
import Spikes from './entities/Spikes.js';
import ParticleEmitter from './emitters/ParticleEmitter.js';
import FireEmitter from './emitters/FireEmitter.js';
import WaterfallEmitter from './emitters/WaterfallEmitter.js';
import SnowfallEmitter from './emitters/SnowfallEmitter.js';
import MagicSpellEmitter from './emitters/MagicSpellEmitter.js';
import PortalEmitter from './emitters/PortalEmitter.js';

export default class NewMapManager {
    constructor({
        mapData,
        tiles,
        mapBackgroundColor,
        gradientTop,
        gradientMiddle,
        gradientBottom,
        useGradient,
        currentMusic,
        platforms,
        enemies,
        collectibles,
        spinningRopes,
        spikes,
        particleEmitters,
        player,
        camera,
        gameLoopId,
        tileSize,
        loadTileImages,
        updateGame
    }) {
        this.mapData = mapData;
        this.tiles = tiles;
        this.mapBackgroundColor = mapBackgroundColor;
        this.gradientTop = gradientTop;
        this.gradientMiddle = gradientMiddle;
        this.gradientBottom = gradientBottom;
        this.useGradient = useGradient;
        this.currentMusic = currentMusic;
        this.platforms = platforms;
        this.enemies = enemies;
        this.collectibles = collectibles;
        this.spinningRopes = spinningRopes;
        this.spikes = spikes;
        this.particleEmitters = particleEmitters;
        this.player = player;
        this.camera = camera;
        this.gameLoopId = gameLoopId;
        this.tileSize = tileSize;
        this.loadTileImages = loadTileImages;
        this.updateGame = updateGame;
    }

    doPlayMusic() {
        if (this.currentMusic) {
            this.currentMusic.play().catch(error => console.log("Audio play error:", error));
        }
    }

    loadMapData(map) {
        // Reset map-related variables
        this.mapData = map.mapData;
        this.tiles = map.tileDefinitions; // Ensure tiles are populated from tileDefinitions

        this.mapBackgroundColor = map.mapBackgroundColor || "#000000";

        this.gradientTop = map.gradientTop || "";
        this.gradientMiddle = map.gradientMiddle || "";
        this.gradientBottom = map.gradientBottom || "";

        // Set useGradient to true if all three gradient values are present, otherwise false
        this.useGradient = this.gradientTop && this.gradientMiddle && this.gradientBottom ? true : false;

        // Stop previous music if playing
        if (this.currentMusic) {
            this.currentMusic.pause();
            this.currentMusic = null;
        }

        // Play new level music if available
        if (map.music) {
            this.currentMusic = new Audio(map.music);
            this.currentMusic.loop = true;
            this.currentMusic.volume = 0.1; // Adjust volume as needed
        }

        // Reset platforms, enemies, collectibles, spinning ropes, and particleEmitters
        this.platforms = [];
        this.enemies = [];
        this.collectibles = [];
        this.spinningRopes = [];
        this.spikes = [];
        this.particleEmitters = [];

        this.loadTileImages();
        this.parseMap(this.mapData);
        this.parseEntities(map.entities);
        this.parseParticles(map.particles);

        // Set player starting position and reset velocity
        this.player = new Player(map.playerStartingPosition.x, map.playerStartingPosition.y);

        // Reset velocity and speed
        this.player.velocityX = 0;
        this.player.velocityY = 0;
        this.player.speed = 2;

        // **Reset the camera to match the new player position**
        this.camera.x = Math.max(0, this.player.x - this.camera.width / 2);
        this.camera.y = Math.max(0, this.player.y - this.camera.height / 2);

        // Stop previous game loop before starting a new one
        if (this.gameLoopId) {
            cancelAnimationFrame(this.gameLoopId);
        }

        // Start a fresh game loop
        this.gameLoopId = requestAnimationFrame(this.updateGame);
    }

    parseMap(mapData) {
        // First pass: Create all platforms
        for (let y = 0; y < mapData.length; y++) {
            for (let x = 0; x < mapData[y].length; x++) {
                const char = mapData[y][x];
                const tileDef = this.tiles[char];

                if (tileDef && (tileDef.type === "solid" || tileDef.type === "passable" || tileDef.type === "loadMap" || tileDef.type === "bounce")) {
                    let image = tileDef.imageObj || null;
                    let color = tileDef.color || null;
                    let width = tileDef.width || this.tileSize;
                    let height = tileDef.height || this.tileSize;
                    let deadly = tileDef.deadly || false;
                    let moveSpeed = tileDef.moveSpeed;
                    let moveDirection = tileDef.moveDirection;
                    let moveRange = tileDef.moveRange;
                    let fallDelay = tileDef.fallDelay;
                    let canFall = tileDef.canFall || false;

                    // Create a platform tile
                    this.platforms.push(
                        new Platform(
                            x * this.tileSize,
                            y * this.tileSize,
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
                const tileDef = this.tiles[char];

                if (tileDef) {
                    let image = tileDef.imageObj || null;
                    let width = tileDef.width || this.tileSize;
                    let height = tileDef.height || this.tileSize;

                    if (tileDef.type === "enemy") {
                        // let enemyX = x * tileSize;
                        // let enemyY = y * tileSize;
                        // let platformBelow = null;
                        // const tolerance = 5;  // Allow a little slack when matching positions

                        // // Patrol logic to determine if the enemy should move left or right and is standing on a platform
                        // // Search through the platforms to find one directly below this enemy.
                        // // We check if the enemy's bottom (enemyY + height) is near a platform's top.
                        // for (let platform of platforms) {
                        //     if (
                        //         enemyX + width > platform.x &&        // Enemy overlaps platform horizontally
                        //         enemyX < platform.x + platform.width &&    // Enemy overlaps platform horizontally
                        //         Math.abs((enemyY + height) - platform.y) <= tolerance // Enemy bottom is within tolerance of platform top
                        //     ) {
                        //         platformBelow = platform;
                        //         break; // Found a matching platform; no need to search further
                        //     }
                        // }

                        // // Determine the enemy type based on the tile definition
                        // let enemyType = tileDef.enemyType || 'patrol';

                        // // Create the enemy with the found platform (or null if not found)
                        // let enemy = new Enemy(enemyX, enemyY, image, platformBelow, enemyType, width, height);
                        // enemies.push(enemy);

                    } else if (tileDef.type === "collectible") {
                        this.collectibles.push(new Collectible(x * this.tileSize, y * this.tileSize, image));
                    }
                }
            }
        }
    }

    parseEntities(entities) {
        if (!Array.isArray(entities)) return; // Ensure entities is an array
        entities.forEach(entity => {
            if (entity.type === "spinningRope") {
                this.spinningRopes.push(new SpinningRope(entity.x, entity.y, entity.length, entity.color, entity.image, entity.spinRate));
            } else if (entity.type === "spikes") {
                this.spikes.push(new Spikes(entity.x, entity.y, entity.width, entity.height, entity.color, entity.riseRate, entity.delay));
            } else if (entity.type === "enemy") {
                let platformBelow = null;
                const tolerance = 5;  // Allow a little slack when matching positions

                // Search through the platforms to find one directly below this enemy.
                for (let platform of this.platforms) {
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
                    this.enemies.push(enemy);
                };
            }
        });
    }

    parseParticles(particles) {
        if (!Array.isArray(particles)) return; // Ensure particles is an array
        particles.forEach(particle => {
            if (particle.type === "particleEmitter") {
                this.particleEmitters.push(new ParticleEmitter(particle.x, particle.y, particle.color1, particle.color2, particle.density, particle.count, particle.image, particle.alignment, particle.emissionSpeed));
            }
            if (particle.type === "fireEmitter") {
                this.particleEmitters.push(new FireEmitter(particle.x, particle.y, particle.color1, particle.color2, particle.density, particle.count, particle.image, particle.alignment, particle.emissionSpeed));
            }
            if (particle.type === "waterfallEmitter") {
                this.particleEmitters.push(new WaterfallEmitter(particle.x, particle.y, particle.color1, particle.color2, particle.density, particle.count, particle.emissionSpeed));
            }
            if (particle.type === "snowfallEmitter") {
                this.particleEmitters.push(new SnowfallEmitter(particle.x, particle.y, particle.color1, particle.color2, particle.density, particle.count, particle.emissionSpeed));
            }
            if (particle.type === "magicSpellEmitter") {
                this.particleEmitters.push(new MagicSpellEmitter(particle.x, particle.y, particle.color1, particle.color2, particle.density, particle.count, particle.emissionSpeed));
            }
            if (particle.type === "portalEmitter") {
                this.particleEmitters.push(new PortalEmitter(particle.x, particle.y, particle.color1, particle.color2, particle.density, particle.count, particle.emissionSpeed));
            }
        });
    }
}
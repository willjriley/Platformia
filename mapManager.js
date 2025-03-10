import Player from './Player.js';
import Platform from './platform.js';
import Coin from './collectibles/Coin.js';
import Heart from './collectibles/Heart.js';
import Speed from './collectibles/Speed.js';
import SpinningRope from './entities/SpinningRope.js';
import Portal from './entities/Portal.js';
import Beholder from './entities/Beholder.js';
import Bear from './entities/Bear.js';
import BigKnight from './entities/BigKnight.js';
import Salamander from './entities/Salamander.js';
import Spikes from './entities/Spikes.js';
import Enemy from './entities/Enemy.js';
import BackgroundImage from './BackgroundImage.js';
import ParticleEmitter from './emitters/ParticleEmitter.js';
import FireEmitter from './emitters/FireEmitter.js';
import WaterfallEmitter from './emitters/WaterfallEmitter.js';
import SnowfallEmitter from './emitters/SnowfallEmitter.js';
import MagicSpellEmitter from './emitters/MagicSpellEmitter.js';
import PortalEmitter from './emitters/PortalEmitter.js';
import { updateGame } from './game.js';

export let currentMusic = null;
export let mapData, player, tiles, mapBackgroundColor, gradientTop, gradientMiddle, gradientBottom, useGradient;
export let platforms = [], collectibles = [], entitiesCollection = [], projectileCollection = [], particleEmitters = [], backgroundImages = [];


let gameLoopId, gravity = 0.25;
let tileSize = 32;

export function loadMapData(map) {
    // Reset map-related variables
    console.log("loadMapData called with map:", map);
    mapData = map.mapData;
    tiles = map.tileDefinitions; // Ensure tiles are populated from tileDefinitions

    mapBackgroundColor = map.mapBackgroundColor || "#000000";

    gradientTop = map.gradientTop || "";
    gradientMiddle = map.gradientMiddle || "";
    gradientBottom = map.gradientBottom || "";

    // Set useGradient to true if all three gradient values are present, otherwise false
    useGradient = gradientTop && gradientMiddle && gradientBottom ? true : false;

    // Stop previous music if playing
    if (currentMusic) currentMusic.pause(), currentMusic = null;

    if (map.music) {
        currentMusic = new Audio(map.music);
        //currentMusic.play();
        currentMusic.loop = true;
        currentMusic.volume = 0.1; // Adjust volume as needed
    }

    // Reset platforms, enemies, collectibles, spinning ropes, and particleEmitters
    platforms = [];
    collectibles = [];
    entitiesCollection = [];
    projectileCollection = [];
    particleEmitters = [];
    backgroundImages = [];

    loadTileImages();
    parseMap(mapData);
    parseEntities(map.entities);
    parseParticles(map.particles);
    parseBackgroundImages(map.backgroundImages);

    // Set player starting position and reset velocity
    player = new Player(map.playerStartingPosition.x, map.playerStartingPosition.y, mapData, 32, gravity);

    // Reset velocity and speed
    player.velocityX = 0;
    player.velocityY = 0;

    // Stop previous game loop before starting a new one
    if (gameLoopId) {
        cancelAnimationFrame(gameLoopId);
    }

    // Start a fresh game loop
    gameLoopId = requestAnimationFrame(updateGame);
}

// call back from animated enemy
function onFireProjectile(projectile) {
    projectileCollection.push(projectile);
}

// Create platforms, enemies, and collectibles from the map
function parseMap(mapData) {
    // First pass: Create all platforms
    for (let y = 0; y < mapData.length; y++) {
        for (let x = 0; x < mapData[y].length; x++) {
            const char = mapData[y][x];
            const tileDef = tiles[char];

            if (tileDef && (tileDef.type === "solid" || tileDef.type === "passable" || tileDef.type === "loadLevel" || tileDef.type === "bounce")) {
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
                        tileDef.level || null,
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
            else if (tileDef && tileDef.type === "coin") {
                collectibles.push(new Coin(x * tileSize, y * tileSize));
            }
            else if (tileDef && tileDef.type === "heart") {
                collectibles.push(new Heart(x * tileSize, y * tileSize));
            }
            else if (tileDef && tileDef.type === "speed") {
                collectibles.push(new Speed(x * tileSize, y * tileSize));
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
        } else if (entity.type === "portal") {
            entitiesCollection.push(new Portal(entity.x, entity.y, entity.targetX, entity.targetY, entity.color1, entity.color2, entity.density, entity.count, entity.emissionSpeed));
        } else if (entity.type === "beholder") {
            entitiesCollection.push(new Beholder(entity.x, entity.y, onFireProjectile));
        } else if (entity.type === "bear") {
            entitiesCollection.push(new Bear(entity.x, entity.y, onFireProjectile));
        } else if (entity.type === "bigknight") {
            entitiesCollection.push(new BigKnight(entity.x, entity.y, onFireProjectile));
        } else if (entity.type === "salamander") {
            entitiesCollection.push(new Salamander(entity.x, entity.y, onFireProjectile));
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

// Parse Background Images from the map
function parseBackgroundImages(backgroundImagesData) {
    if (!Array.isArray(backgroundImagesData)) return; // Ensure backgroundImagesData is an array
    backgroundImagesData.forEach(bgImage => {
        backgroundImages.push(new BackgroundImage(bgImage.x, bgImage.y, bgImage.width, bgImage.height, bgImage.imageSrc));
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

export async function loadMap(mapName) {
    console.log(`selectMap called with mapName: ${mapName}`);
    try {
        const response = await fetch(`assets/maps/${mapName}.json`);
        if (!response.ok) {
            throw new Error(`Failed to load map: ${mapName}`);
        }
        const mapData = await response.json();
        // console.log("Map data loaded:", mapData);
        loadMapData(mapData);
    } catch (error) {
        console.error(error);
    }
}

export function setCollectibles(collection) {
    collectibles = collection;
}

export function setProjectileCollection(collection) {
    projectileCollection = collection;
}

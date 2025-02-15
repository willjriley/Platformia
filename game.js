// Game setup
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
// ctx.imageSmoothingEnabled = true;

const width = canvas.width = 800;
const height = canvas.height = 600;
const tileSize = 32;

let mapData = [];
let tileDefinitions = {};
let mapBackgroundColor = "#000000";
let useGradient = false;
let gradientTop = null;
let gradientMiddle = null;
let gradientBottom = null;


// Game objects
let platforms = [];
let collectibles = [];
let camera = { x: 0, y: 0, width: 800, height: 400 };
let gravity = 0.5;
let player;
let enemies = [];
let score = 0;
let lives = 3;
let paused = false;
let gameStarted = false;
let gameLoopId = null; // Store the current game loop
let respawning = false; // Add a flag to indicate respawning
let gamePaused = false; // Add a flag to indicate game pause

//helper
function getPlatformAt(x, y) {
    for (let i = 0; i < platforms.length; i++) {
        const plat = platforms[i];
        if (
            x >= plat.x &&
            x < plat.x + plat.width &&
            y >= plat.y &&
            y < plat.y + plat.height
        ) {
            return plat;
        }
    }
    return null;
}

// Check collisions with platforms
function checkCollisions() {
    let isOnPlatform = false;
    const maxFallSpeed = 10;
    player.velocityY = Math.min(player.velocityY, maxFallSpeed); // Limit falling speed

    // First, handle horizontal movement
    for (let platform of platforms) {
        let collidesHorizontally = player.x + player.width > platform.x && player.x < platform.x + platform.width;
        let collidesVertically = player.y + player.height > platform.y && player.y < platform.y + platform.height;


        // Check if player is on a loadMap tile
        if (collidesHorizontally && collidesVertically) {

            if (platform.type === "loadMap") {
                if (platform.script && window[platform.script]) {
                    loadMapData(window[platform.script]);
                    return;
                }
            }

            // Handle horizontal collisions
            if (player.velocityX > 0) { // Moving right
                player.x = platform.x - player.width - 0.1; // Small buffer to prevent sticking
                player.velocityX = 0;
            } else if (player.velocityX < 0) { // Moving left
                player.x = platform.x + platform.width + 0.1;
                player.velocityX = 0;
            }
        }
    }

    // Then, handle vertical movement
    for (let platform of platforms) {
        let collidesHorizontally = player.x + player.width > platform.x && player.x < platform.x + platform.width;
        let collidesVertically = player.y + player.height > platform.y && player.y < platform.y + platform.height;

        // Re-check isLoadMap here for platforms that might have been missed
        if (collidesHorizontally && collidesVertically) {
            if (platform.type === "loadMap") {
                if (platform.script && window[platform.script]) {
                    loadMapData(window[platform.script]);
                    return;
                }
            }
        }

        // Check if the player is landing on a platform (hitting the top)
        if (
            collidesHorizontally &&
            player.y + player.height <= platform.y + player.velocityY + 1 &&
            player.y + player.height + player.velocityY >= platform.y
        ) {
            player.y = platform.y - player.height;
            player.velocityY = 0;
            player.isJumping = false;
            isOnPlatform = true;

            // Check if the player is standing on a bounce tile  
            if (platform.type === "bounce") {
                player.bounce(platform.force, 'vertical'); // Apply bounce force upwards 

                let bounceSound = new Audio("./assets/sounds/springy-bounce-86214.mp3");
                bounceSound.play();
            }

            // Check if the player is standing on a loadMap tile and pressing the down key
            if (platform.type === "loadMap" && platform.script && window[platform.script] && keys.down) {
                loadMapData(window[platform.script]);
                return;
            }

        }

        // Prevent the player from jumping through platforms (hitting the bottom)
        if (
            collidesHorizontally &&
            player.y < platform.y + platform.height &&
            player.y + player.height > platform.y &&
            player.velocityY < 0
        ) {
            player.y = platform.y + platform.height + 0.1; // Small buffer
            player.velocityY = 0;
        }
    }

    // Check for collectible collisions
    collectibles = collectibles.filter(collectible => {
        if (
            player.x + player.width > collectible.x &&
            player.x < collectible.x + collectible.width &&
            player.y + player.height > collectible.y &&
            player.y < collectible.y + collectible.height
        ) {
            let collectibleSound = new Audio("./assets/sounds/coin-dropped-81172.mp3");
            collectibleSound.play();
            score += 5; // Increase score by 5
            return false; // Remove the collected item
        }
        return true; // Keep uncollected items
    });

    // Check for enemy collisions
    enemies.forEach(enemy => {
        if (
            player.x + player.width > enemy.x &&
            player.x < enemy.x + enemy.width &&
            player.y + player.height > enemy.y &&
            player.y < enemy.y + enemy.height
        ) {
            loseLife(); // Call function when player touches an enemy
        }
    });

    // If the player isn't standing on a platform, mark as jumping
    if (!isOnPlatform) {
        player.isJumping = true;
    }
}

function displayYouDiedMessage() {
    ctx.fillStyle = "red";
    ctx.font = "bold 50px 'Courier New', monospace";
    const text = "YOU DIED";
    const textWidth = ctx.measureText(text).width;
    ctx.fillText(text, (width - textWidth) / 2, height / 2);
}

function loseLife() {
    if (respawning) return; // Prevent multiple calls during respawn

    lives--; // Reduce lives by 1
    player.isJumping = false;
    player.velocityX = 0;
    player.velocityY = 0;

    let deathSound = new Audio("./assets/sounds/8-bit-wrong-2-84407.mp3");
    deathSound.play();

    if (lives <= 0) {
        location.reload(); // Reload the page
        return;
    } else {
        respawning = true; // Set respawning flag
        gamePaused = true; // Pause the game

        // Display "You Died" message
        displayYouDiedMessage();

        // Add a short delay before respawning
        setTimeout(() => {
            // set player respawn position
            player.x = 50;
            player.y = height - 60;
            respawning = false; // Reset respawning flag
            gamePaused = false; // Resume the game
        }, 1000); // 1 second delay
    }
}

// Handle scrolling
function handleScrolling() {
    const edgeDistance = 200; // Increase this value to increase the distance from the edge

    // Move camera when player reaches edges of screen
    if (player.x > camera.x + camera.width - edgeDistance) {
        camera.x = Math.floor(player.x - camera.width + edgeDistance);
    } else if (player.x < camera.x + edgeDistance) {
        camera.x = Math.floor(player.x - edgeDistance);
    }

    // Ensure the camera stays within the bounds of the map
    const maxCameraX = (mapData[0].length * tileSize) - camera.width;
    if (camera.x > maxCameraX) {
        camera.x = maxCameraX;
    }
    if (camera.x < 0) {
        camera.x = 0;
    }
}

// Update the game
function updateGame() {

    if (!gameStarted) {
        let gradient = ctx.createLinearGradient(0, 0, 0, height); // Vertical gradient
        gradient.addColorStop(0, "#001F3F");
        gradient.addColorStop(0.5, "#0074D9");
        gradient.addColorStop(1, "#7FDBFF");

        ctx.fillStyle = gradient;

        ctx.fillRect(0, 0, width, height); // Fill the whole canvas with the background color

        ctx.font = "bold 30px 'Courier New', monospace";
        ctx.fillStyle = "BLACK";
        const text1 = "* PLATFORMIA  *";
        const text1Width = ctx.measureText(text1).width;
        ctx.fillText(text1, (width - text1Width) / 2, height / 2 - 128);

        ctx.fillStyle = "RED";
        const text2 = "GAME OVER";
        const text2Width = ctx.measureText(text2).width;
        ctx.fillText(text2, (width - text2Width) / 2, height / 2 - 64);

        ctx.fillStyle = "white";
        const text3 = "PRESS 1 TO START";
        const text3Width = ctx.measureText(text3).width;
        ctx.fillText(text3, (width - text3Width) / 2, height / 2 - 2);

        requestAnimationFrame(updateGame); // Keep checking
        return;
    }

    if (gamePaused) {
        // Display "You Died" message if lives were lost
        if (lives < 3 && respawning) {
            displayYouDiedMessage();
        }
        requestAnimationFrame(updateGame); // Keep checking
        return;
    }

    if (useGradient) {
        let gradient = ctx.createLinearGradient(0, 0, 0, height); // Vertical gradient
        gradient.addColorStop(0, gradientTop);
        gradient.addColorStop(0.5, gradientMiddle);
        gradient.addColorStop(1, gradientBottom);

        ctx.fillStyle = gradient;
    }
    else {
        ctx.fillStyle = mapBackgroundColor;
    }

    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = "white";

    if (paused) {
        ctx.fillText(" PAUSED ", width / 2 - 80, height / 2);
        requestAnimationFrame(updateGame); // Keep checking
        return;
    }

    if (gameLoopId) {
        cancelAnimationFrame(gameLoopId); // Prevent multiple loops
    }

    gameLoopId = requestAnimationFrame(updateGame);

    handleInput(); // Handle input in the main loop

    player.move();
    handleScrolling();

    // Draw platforms
    platforms.forEach(platform => platform.draw());

    ctx.fillStyle = "white";
    ctx.font = "bold 30px 'Courier New', monospace";
    ctx.fillText("SCORE: " + score, 60, 50);
    ctx.fillText("LIVES: " + lives, 550, 50);


    // Draw collectibles
    collectibles.forEach(collectible => collectible.draw());

    // Draw enemies and let them patrol
    enemies.forEach(enemy => {
        enemy.patrol(); // Make enemy patrol
        enemy.draw();
    });

    // Draw player
    player.draw();

    // Check collisions with platforms
    checkCollisions();

    // Display "You Died" message if lives were lost
    if (lives < 3 && respawning) {
        displayYouDiedMessage();
    }
}

// Initialize game
function initGame(selectedMap) {
    // Start the game loop
    loadMapData(selectedMap);
}

// Start the game
initGame(map0);

// Game setup
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
// ctx.imageSmoothingEnabled = true;

const width = canvas.width = 800;
const height = canvas.height = 600;
const tileSize = 32;

let mapData = [];
let tiles = {};
let mapBackgroundColor = "#000000";
let useGradient = false;
let gradientTop = null;
let gradientMiddle = null;
let gradientBottom = null;

// Add a global variable to store mouse coordinates
let mouseX = 0;
let mouseY = 0;

// Add an event listener to update mouse coordinates
canvas.addEventListener('mousemove', function (event) {
    const rect = canvas.getBoundingClientRect();
    mouseX = event.clientX - rect.left + window.scrollX + camera.x;
    mouseY = event.clientY - rect.top + window.scrollY;
});
// Game objects
let platforms = [];
let collectibles = [];
let camera = { x: 0, y: 0, width: 800, height: 400 };
let gravity = 0.25;
let player;
let enemies = [];
let spinningRopes = [];
let spikes = [];
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

function checkCollisions() {
    let isOnPlatform = false;
    const maxFallSpeed = 10;
    player.velocityY = Math.min(player.velocityY, maxFallSpeed); // Limit falling speed

    for (let platform of platforms) {
        if (String(platform.type).toLocaleLowerCase() != "passable" && isColliding(player, platform)) {
            // Check if the platform is deadly
            if (platform.deadly) {
                loseLife(); // Player loses a life if they touch a deadly platform
                return;
            }

            // Check if player is on a loadMap tile
            if (platform.type === "loadMap") {
                if (platform.script && platform.script !== "") {
                    selectMap(platform.script);
                    return;
                }
            }

            // Check if the player is standing on a loadMap tile and pressing the down key
            // if (platform.type === "loadMap" && platform.script && window[platform.script] && keys.down) {
            //     loadMapData(window[platform.script]);
            //     return;
            // }

            //     console.log("player.y", player.y, "player.x", player.x, "player.width", player.width, "player.height", player.height, "player.velocityY", player.velocityY, "player.velocityX", player.velocityX);
            //     console.log("platform.y", platform.y, "platform.x", platform.x, "platform.width", platform.width, "platform.height", platform.height);
            // Check if the player is standing on a bounce tile

            if (platform.type === "bounce") {
                player.bounce(platform.force, 'vertical'); // Apply bounce force upwards

                let bounceSound = new Audio("./assets/sounds/springy-bounce-86214.mp3");
                bounceSound.play();
                return;
            }

            // Calculate player boundaries
            const playerTopBoundary = player.y;
            const playerBottomBoundary = player.y + player.height;
            const playerLeftBoundary = player.x;
            const playerRightBoundary = player.x + player.width;

            // Calculate platform boundaries
            const platformTopBoundary = platform.y;
            const platformBottomBoundary = platform.y + platform.height;
            const platformLeftBoundary = platform.x;
            const platformRightBoundary = platform.x + platform.width;

            // Check player tile boundaries
            const velocityBuffer = .5; // Small buffer to prevent sticking

            // the player hits the top of a platform
            if ((playerBottomBoundary) <= platformTopBoundary + player.velocityY + velocityBuffer &&
                (playerBottomBoundary) + player.velocityY > 0) {
                // keep player on top of platform
                player.velocityY = 0;
                player.y = platform.y - player.height;

                player.isJumping = false;
                isOnPlatform = true;

            } else if (playerTopBoundary < platformBottomBoundary &&
                playerBottomBoundary > platformTopBoundary &&
                playerRightBoundary > platformLeftBoundary &&
                playerLeftBoundary < platformRightBoundary &&
                player.velocityY < 0 && !isOnPlatform) {
                // player hits the bottom of a platform
                player.velocityY = 0;
            }

            // Ensure the player is horizontally overlapping with the platform
            if (playerRightBoundary > platformLeftBoundary &&
                playerLeftBoundary < platformRightBoundary &&
                playerBottomBoundary > platformTopBoundary &&
                playerTopBoundary < platformBottomBoundary) {

                // Handle right collision
                if (player.velocityX > 0 && playerRightBoundary <= platformLeftBoundary + player.velocityX + velocityBuffer) {
                    // Player hit right side of platform.
                    player.x = platformLeftBoundary - player.width;
                    player.velocityX = 0;

                    // Handle left collision
                } else if (player.velocityX < 0 && playerLeftBoundary >= platformRightBoundary + player.velocityX - velocityBuffer) {
                    // Player hit left side of platform.
                    player.x = platformRightBoundary + velocityBuffer;
                    player.velocityX = 0;
                }
            }
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

    // Check for spinning rope collisions
    spinningRopes.forEach(rope => {
        if (rope.checkCollision(player)) {
            loseLife(); // Player loses a life if they touch the spinning rope
        }
    });

    // Check for spinning rope collisions
    spikes.forEach(spike => {
        if (spike.checkCollision(player)) {
            loseLife(); // Player loses a life if they touch the spinning rope
        }
    });

    // If the player isn't standing on a platform, mark as jumping
    if (!isOnPlatform) {
        player.isJumping = true;
    }
}

function isColliding(player, platform) {
    let collidesHorizontally = (player.x + player.width) > (platform.x) && (player.x) < (platform.x + platform.width);
    let collidesVertically = (player.y + player.height) > (platform.y) && (player.y) < (platform.y + platform.height);
    return collidesHorizontally && collidesVertically;
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
    const edgeDistance = 300; // Increase this value to increase the distance from the edge

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
        let gradient = ctx.createLinearGradient(0, 0, 0, canvas.height); // Vertical gradient
        gradient.addColorStop(0, "#001F3F");
        gradient.addColorStop(0.5, "#0074D9");
        gradient.addColorStop(1, "#7FDBFF");

        ctx.fillStyle = gradient;

        ctx.fillRect(0, 0, canvas.width, canvas.height); // Fill the whole canvas with the background color

        ctx.font = "bold 30px 'Courier New', monospace";
        ctx.fillStyle = "BLACK";
        const text1 = "* PLATFORMIA  *";
        const text1Width = ctx.measureText(text1).width;
        ctx.fillText(text1, (canvas.width - text1Width) / 2, canvas.height / 2 - 128);

        ctx.fillStyle = "RED";
        const text2 = "GAME OVER";
        const text2Width = ctx.measureText(text2).width;
        ctx.fillText(text2, (canvas.width - text2Width) / 2, canvas.height / 2 - 64);

        ctx.fillStyle = "white";
        const text3 = "PRESS 1 TO START";
        const text3Width = ctx.measureText(text3).width;
        ctx.fillText(text3, (canvas.width - text3Width) / 2, canvas.height / 2 - 2);

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
        let gradient = ctx.createLinearGradient(0, 0, 0, canvas.height); // Vertical gradient
        gradient.addColorStop(0, gradientTop);
        gradient.addColorStop(0.5, gradientMiddle);
        gradient.addColorStop(1, gradientBottom);

        ctx.fillStyle = gradient;
    }
    else {
        ctx.fillStyle = mapBackgroundColor;
    }

    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "white";

    if (paused) {
        ctx.fillText(" PAUSED ", canvas.width / 2 - 80, canvas.height / 2);
        // Display mouse coordinates
        ctx.font = "bold 20px 'Courier New', monospace";
        ctx.fillText(`Mouse X: ${mouseX}, Mouse Y: ${mouseY}`, 10, 30);

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

    // Update and draw platforms
    platforms.forEach(platform => {
        platform.update(player); // Pass the player to the update method
        platform.draw(ctx, camera); // Pass the camera to the draw method
    });

    // Update and draw enemies
    enemies.forEach(enemy => {
        enemy.update(player); // Update enemy behavior
        enemy.draw(); // Draw enemy
    });

    // Update and draw spinning ropes
    spinningRopes.forEach(rope => {
        rope.update();
        rope.draw(ctx, camera); // Pass the camera to the draw method
        if (rope.checkCollision(player)) {
            loseLife(); // Player loses a life if they touch the spinning rope
        }
    });

    // Update and draw spikes
    spikes.forEach(spike => {
        spike.update();
        spike.draw(ctx, camera); // Pass the camera to the draw method
        if (spike.checkCollision(player)) {
            loseLife(); // Player loses a life if they touch the spikes
        }
    });

    // Update and draw particle emitters
    particleEmitters.forEach(particleEmitter => {
        particleEmitter.update();
        particleEmitter.draw(ctx, camera); // Pass the camera to the draw method
    });

    // Draw player
    player.draw(ctx, camera);

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

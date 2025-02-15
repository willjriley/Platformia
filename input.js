// Handle input
let keys = { right: false, left: false, space: false, down: false, up: false };
let musicStarted = false;

document.addEventListener('keydown', (e) => {
    if (e.key === '1') {
        gameStarted = true;
    }
    if (gameStarted) {
        if (e.key === 'ArrowRight') keys.right = true;
        if (e.key === 'ArrowLeft') keys.left = true;
        if (e.key === 'ArrowDown') keys.down = true;
        if (e.key === 'ArrowUp') keys.up = true;
        if (e.key === ' ') keys.space = true;
        if (e.key === 'p' || e.key === 'Escape') {
            if (!gameStarted) {
                return
            }
            paused = !paused;

            if (currentMusic) {
                if (paused) {
                    currentMusic.pause(); // Pause music
                } else {
                    currentMusic.play(); // Resume music
                }
            }
            // Toggle pause
            if (!paused && !gameLoopId) {
                updateGame(); // Resume game loop only if not already running
            }
        }
        else {
            if (currentMusic) {
                currentMusic.play();
            }
        }
    }
});

document.addEventListener('keyup', (e) => {
    if (gameStarted) {
        if (e.key === 'ArrowRight') keys.right = false;
        if (e.key === 'ArrowLeft') keys.left = false;
        if (e.key === 'ArrowDown') keys.down = false;
        if (e.key === 'ArrowUp') keys.up = false;
        if (e.key === ' ') keys.space = false;
    }
});

// Input handling
function handleInput() {
    // Apply velocity for movement
    if (keys.right) {
        player.facing = 'right'
        player.velocityX = player.speed;
    }
    else if (keys.left) {
        player.facing = 'left'
        player.velocityX = -player.speed;
    }
    else player.velocityX = 0; // Stop moving when no key is pressed

    // Handle jumping
    if (keys.space && !player.isJumping) {
        player.velocityY = player.jumpPower;
        player.isJumping = true;
    }
}

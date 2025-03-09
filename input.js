import { gameState, setPauseGame, updateGame, gameLoopId } from './game.js';
import { currentMusic } from './mapManager.js';

export let keys = { right: false, left: false, space: false, down: false, up: false };
export let musicStarted = false;

let debounceTimeout = null;

function handleKeyDown(e) {
    debounceTimeout = setTimeout(() => {
        debounceTimeout = null; // Reset debounce timeout after a delay
    }, 200);

    if (e.key === '1') {
        gameState.gameStarted = true;
    }
    if (gameState.gameStarted) {
        if (e.key === 'ArrowRight' || e.key.toLowerCase() === 'd') keys.right = true;
        if (e.key === 'ArrowLeft' || e.key.toLowerCase() === 'a') keys.left = true;
        if (e.key === 'ArrowDown' || e.key === 's') keys.down = true;
        if (e.key === 'ArrowUp' || e.key.toLowerCase() === 'w') keys.up = true;
        if (e.key === ' ') keys.space = true;
        if (e.key.toLocaleLowerCase() === 'p' || e.key === 'Escape') {
            setPauseGame();
            console.log("yes", gameState.paused);

            if (currentMusic) {
                if (gameState.paused) {
                    currentMusic.pause(); // Pause music
                } else {
                    const playPromise = currentMusic.play();
                    if (playPromise !== undefined) {
                        playPromise.catch(error => {
                            console.error('Music play was interrupted:', error);
                        });
                    }
                }
            }

            // Toggle pause
            if (!gameState.paused && !gameLoopId) {
                updateGame(); // Resume game loop only if not already running
            }
        }
    }
}

function handleKeyUp(e) {
    if (gameState.gameStarted) {
        if (e.key === 'ArrowRight' || e.key.toLowerCase() === 'd') keys.right = false;
        if (e.key === 'ArrowLeft' || e.key.toLowerCase() === 'a') keys.left = false;
        if (e.key === 'ArrowDown' || e.key === 's') keys.down = false;
        if (e.key === 'ArrowUp' || e.key.toLowerCase() === 'w') keys.up = false;
        if (e.key === ' ') keys.space = false;
    }
}

export function initializeInputHandlers(updateGame, gameLoopId) {
    // Remove existing event listeners before adding new ones
    document.removeEventListener('keydown', handleKeyDown);
    document.removeEventListener('keyup', handleKeyUp);

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
}

export function handleInput(player) {
    if (!player) {
        return; // Exit if player is not initialized
    }

    // Apply velocity for movement
    if (keys.right) {
        player.facing = 'right';
        player.velocityX = player.speed;
    } else if (keys.left) {
        player.facing = 'left';
        player.velocityX = -player.speed;
    } else {
        player.velocityX = 0; // Stop moving when no key is pressed
    }

    // Handle jumping
    if (keys.space && !player.isJumping) {
        player.velocityY = player.jumpPower;
        player.isJumping = true;
    }
}
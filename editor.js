import { loadMapData, platforms, entitiesCollection, player } from './editMapManager.js';

let canvas, ctx, width, height, tileSize;
let gameLoopId;
let scrollX = 0, scrollY = 0;
const scrollSpeed = 10;
let currentMapData; // Store mapData in a variable accessible throughout the module
let showGrid = true;

export function initEditor(mapData) {
    // Game setup
    canvas = document.getElementById('gameCanvas');
    ctx = canvas.getContext('2d');
    width = canvas.width = 800;
    height = canvas.height = 600;
    tileSize = 32;

    // Reset scroll position
    scrollX = 0;
    scrollY = 0;

    // Store mapData in the module-level variable
    currentMapData = mapData;

    // Load map data
    loadMapData(mapData);

    // Add keyboard event listeners for scrolling
    window.addEventListener('keydown', handleScroll);

    // Add mouse event listener for context menu
    canvas.addEventListener('contextmenu', handleContextMenu);

    // Start the game loop
    if (gameLoopId) {
        cancelAnimationFrame(gameLoopId);
    }
    gameLoopId = requestAnimationFrame(updateEditor);
}

function handleScroll(event) {
    if (!currentMapData) return; // Ensure currentMapData is defined

    switch (event.key) {
        case 'ArrowUp':
            scrollY = Math.max(0, scrollY - scrollSpeed);
            break;
        case 'ArrowDown':
            scrollY = Math.min(currentMapData.mapData.length * tileSize - height, scrollY + scrollSpeed);
            break;
        case 'ArrowLeft':
            scrollX = Math.max(0, scrollX - scrollSpeed);
            break;
        case 'ArrowRight':
            scrollX = Math.min(currentMapData.mapData[0].length * tileSize - width, scrollX + scrollSpeed);
            break;
    }
}

function handleContextMenu(event) {
    event.preventDefault(); // Prevent the default context menu from appearing
    const x = event.offsetX + scrollX;
    const y = event.offsetY + scrollY;

    const platform = platforms.find(p => x >= p.x && x <= p.x + p.width && y >= p.y && y <= p.y + p.height);
    if (platform) {
        showContextMenu(event, platform);
    } else {
        showContextMenu(event, { x, y, width: tileSize, height: tileSize, color: 'transparent' });
    }
}

function updateEditor() {
    // Clear the canvas
    ctx.clearRect(0, 0, width, height);

    // Save the current context state
    ctx.save();

    // Translate the context based on the scroll position
    ctx.translate(-scrollX, -scrollY);

    // Draw the game elements
    drawGrid();
    drawPlatforms();
    drawEntities();
    drawPlayer();

    // Restore the context to its original state
    ctx.restore();

    // Request the next frame
    gameLoopId = requestAnimationFrame(updateEditor);
}

function drawGrid() {
    if (!showGrid) return;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    for (let x = scrollX - (scrollX % tileSize); x < scrollX + width; x += tileSize) {
        for (let y = scrollY - (scrollY % tileSize); y < scrollY + height; y += tileSize) {
            ctx.strokeRect(x, y, tileSize, tileSize);
        }
    }
}

function drawPlatforms() {
    platforms.forEach(platform => {
        if (platform.image) {
            ctx.drawImage(platform.image, platform.x, platform.y, platform.width, platform.height);
        } else {
            if (platform.color === 'transparent') {
                ctx.strokeStyle = 'red'; // Set border color for transparent platforms
                ctx.lineWidth = 2; // Set border width
                ctx.strokeRect(platform.x, platform.y, platform.width, platform.height);
                ctx.beginPath();
                ctx.moveTo(platform.x, platform.y);
                ctx.lineTo(platform.x + platform.width, platform.y + platform.height);
                ctx.moveTo(platform.x + platform.width, platform.y);
                ctx.lineTo(platform.x, platform.y + platform.height);
                ctx.stroke();
            } else {
                ctx.fillStyle = platform.color;
                ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
            }
        }
    });

    // Draw empty cells
    if (showGrid) {
        const rows = Math.ceil(height / tileSize);
        const cols = Math.ceil(width / tileSize);
        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < cols; x++) {
                const isEmpty = !platforms.some(p => p.x === (x * tileSize + scrollX - (scrollX % tileSize)) && p.y === (y * tileSize + scrollY - (scrollY % tileSize)));
                if (isEmpty) {
                    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
                    ctx.strokeRect(x * tileSize + scrollX - (scrollX % tileSize), y * tileSize + scrollY - (scrollY % tileSize), tileSize, tileSize);
                }
            }
        }
    }
}

function drawEntities() {
    entitiesCollection.forEach(entity => {
        if (entity.image) {
            ctx.drawImage(entity.image, entity.x, entity.y, entity.width, entity.height);
        } else {
            ctx.fillStyle = entity.color;
            ctx.fillRect(entity.x, entity.y, entity.width, entity.height);
        }
    });
}

function drawPlayer() {
    if (player.image) {
        ctx.drawImage(player.image, player.x, player.y, player.width, player.height);
    } else {
        ctx.fillStyle = player.color;
        ctx.fillRect(player.x, player.y, player.width, player.height);
    }
}

export function toggleGrid(checked) {
    showGrid = checked;
}

export { updateEditor, platforms, entitiesCollection, player };
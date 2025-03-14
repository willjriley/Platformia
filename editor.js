import { loadMapData, platforms, entitiesCollection, player } from './editMapManager.js';

let canvas, ctx, width, height, tileSize;
let gameLoopId;
let scrollX = 0, scrollY = 0;
const scrollSpeed = 10;
let currentMapData; // Store mapData in a variable accessible throughout the module
let showGrid = true;
let showGradient = true; // Add a variable to track the gradient visibility
let clipboard = null; // Store the copied platform
let selectedPlatform = null; // Declare selectedPlatform to track the currently selected platform

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

    if (showGradient && currentMapData.gradientTop && currentMapData.gradientMiddle && currentMapData.gradientBottom) {
        let gradient = ctx.createLinearGradient(0, 0, 0, canvas.height); // Vertical gradient
        gradient.addColorStop(0, currentMapData.gradientTop);
        gradient.addColorStop(0.5, currentMapData.gradientMiddle);
        gradient.addColorStop(1, currentMapData.gradientBottom);

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height); // Apply the gradient to the canvas
    } else {
        ctx.fillStyle = currentMapData.mapBackgroundColor || '#000000'; // Fallback to the background color
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

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

function toggleGradient(checked) {
    showGradient = checked;
}

function cut() {
    clipboard = { ...selectedPlatform }; // Store a copy of the selected platform in the clipboard
    platforms.splice(platforms.indexOf(selectedPlatform), 1); // Remove the selected platform from the platforms array
    selectedPlatform = null;
    hideContextMenu();
    updateEditor(); // Redraw the canvas to reflect the changes
}

function copy() {
    clipboard = { ...selectedPlatform }; // Store a copy of the selected platform in the clipboard
    selectedPlatform = null;
    hideContextMenu();
}

function paste() {
    if (clipboard) {
        console.log('Pasting platform:', clipboard);
        canvas.addEventListener('click', placeCopiedPlatform, { once: true });
    } else {
        console.log('Clipboard is empty. Cannot paste.');
    }
    hideContextMenu();
}

function placeCopiedPlatform(event) {
    // Calculate the grid position based on the click coordinates
    const x = Math.floor((event.offsetX + scrollX) / 32) * 32;
    const y = Math.floor((event.offsetY + scrollY) / 32) * 32;

    console.log('Placing platform at:', { x, y });

    // Check if a platform already exists at the target cell
    const existingPlatformIndex = platforms.findIndex(p => p.x === x && p.y === y);

    if (existingPlatformIndex !== -1) {
        // Remove the existing platform
        platforms.splice(existingPlatformIndex, 1);
        console.log(`Overriding existing platform at (${x}, ${y})`);
    }

    // Create a new platform object based on the clipboard
    const newPlatform = { ...clipboard, x, y };

    // Add the new platform to the platforms array
    platforms.push(newPlatform);

    console.log('Updated platforms array:', platforms);

    // Redraw the canvas to reflect the changes
    updateEditor();
}

function showContextMenu(event, platform) {
    event.preventDefault();
    selectedPlatform = platform; // Assign the selected platform
    const contextMenu = document.getElementById('contextMenu');
    contextMenu.style.display = 'block';
    contextMenu.style.left = `${event.pageX}px`;
    contextMenu.style.top = `${event.pageY}px`;

    // Enable or disable the "Paste" option based on clipboard content
    const pasteOption = document.getElementById('pasteOption');
    if (clipboard) {
        pasteOption.classList.remove('disabled');
    } else {
        pasteOption.classList.add('disabled');
    }
}

export { updateEditor, platforms, entitiesCollection, player, toggleGradient };
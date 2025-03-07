import Projectile from './Projectile.js';

export default class AnimatedEnemy {
    constructor(x, y, mode = 'patrol', onFireProjectile, animationDataUrl) {
        this.x = x;
        this.y = y;
        this.startX = x; // Store the starting position for Hunter mode
        this.startY = y;
        this.width = null;
        this.height = null;
        this.idleTime = 0; // Time the enemy will stand idle before resuming patrol
        this.patrolDirection = 'right'; // Direction the enemy is patrolling
        this.speed = 1; // Patrol speed
        this.restoreSpeed = 1;
        this.aggroSpeed = 1;
        this.mode = mode; // mode of enemy: 'patrol' or 'hunter'
        this.chaseRange = 250; // Range within which the Hunter chases the player
        this.pauseTimeout = null; // Store the timeout ID for pausing patrol
        this.justRespawned = false; // Flag to indicate if the enemy has just respawned
        this.projectiles = []; // Array to store active projectiles
        this.onFireProjectile = onFireProjectile; // Callback function for handling projectile firing events
        this.projectileImage = null; // Image for the projectile
        this.projectileYOffset = null; // Offset for the projectile's y position
        this.projectileSpeed = null; // Speed of the projectile pixel per second
        this.projectileReloadTime = null; // Time between projectile fires
        this.canAttack = true; // Flag to indicate if the enemy has canAttack
        this.useProjectile = false; // Flag to indicate if the enemy uses projectiles
        this.seeDistance = 1; // Distance at which the enemy can see the player
        this.projectileBoundingBox = null;
        this.animationDataUrl = animationDataUrl; // URL for animation data
        this.debugMode = true; // Debug mode flag
        this.sensorXOffset = 0; // Offset for the sensor's x position
        this.sensorYOffset = 0; // Offset for the sensor's y position

        // Load animation data
        this.animations = {};
        this.loadAnimations();

        // Set the initial state and frame
        this.state = null;
        this.frameIndex = 0;
        this.tickCount = 0;
        this.ticksPerFrame = 10; // Adjust this value to control the animation speed
        this.image = null;
        this.boundingBox = null;
        this.camera = { x: 0, y: 0, width: 800, height: 400 };// need to update this to pass into the constructor
    }

    async loadAnimations() {
        try {
            const response = await fetch(this.animationDataUrl);
            const data = await response.json();
            data.states.forEach(state => {
                this.animations[state.state] = state.frames.map(frame => ({
                    image: this.loadImage(frame.src),
                    boundingBox: frame.boundingBox
                }));
            });

            // Load the projectile image
            this.projectileImage = this.loadImage(data.projectileImage);
            this.width = data.width;
            this.height = data.height;
            this.speed = data.speed;
            this.restoreSpeed = data.speed;
            this.aggroSpeed = data.aggroSpeed;
            this.idleTime = data.idleTime;
            this.projectileYOffset = data.projectileYOffset;
            this.projectileSpeed = data.projectileSpeed;
            this.projectileReloadTime = data.projectileReloadTime;
            this.useProjectile = data.useProjectile;
            this.seeDistance = data.seeDistance;
            this.projectileBoundingBox = data.projectileBoundingBox;
            this.sensorXOffset = data.sensorXOffset || 0;
            this.sensorYOffset = data.sensorYOffset || 0;

            // Set the initial state and frame after loading animations
            this.state = data.default;
            if (this.animations[this.state] && this.animations[this.state][0]) {
                this.image = this.animations[this.state][this.frameIndex].image;
                this.boundingBox = this.animations[this.state][this.frameIndex].boundingBox;
                if (this.debugMode) console.log(`Initial state set to ${this.state}`);
            } else {
                console.error('Failed to set initial state and frame: Invalid state or frames');
            }
        } catch (error) {
            console.error('Failed to load animation data:', error);
        }
    }

    loadImage(src) {
        const img = new Image();
        img.onload = () => console.log(`Image loaded: ${src}`);
        img.onerror = () => console.error(`Failed to load image: ${src}`);
        img.src = src;
        return img;
    }

    setState(state, nextState = null) {
        if (this.debugMode) console.log("Setting state to", state);

        if (this.animations[state]) {
            this.state = state;
            this.frameIndex = 0;
            if (this.animations[this.state][0]) {
                this.image = this.animations[this.state][this.frameIndex].image;
                this.boundingBox = this.animations[this.state][this.frameIndex].boundingBox;
                if (this.debugMode) console.log(`State set to ${state}`);

                // If nextState is provided, set a timeout to change the state after the current animation loop completes
                if (nextState) {
                    const animationDuration = this.animations[this.state].length * this.ticksPerFrame * (1000 / 60); // Assuming 60 FPS
                    setTimeout(() => {
                        this.setState(nextState);
                    }, animationDuration);
                }
            } else {
                console.error('Failed to set state: Invalid frames');
            }
        } else {
            console.error('Failed to set state: Invalid state');
        }
    }

    respawn() {

        if (this.debugMode) console.log("Respawning enemy");
        this.x = this.startX;
        this.y = this.startY;
        this.patrolDirection = 'right';
        this.setState("walk_right");
        this.pauseTimeout = null;
        this.frameIndex = 0;
        this.tickCount = 0;
        this.speed = this.restoreSpeed;
        this.canAttack = false;

        // Clear any pending pause timeout
        if (this.pauseTimeout) {
            clearTimeout(this.pauseTimeout);
            this.pauseTimeout = null;
        }

        // Reset mode to patrol
        this.mode = 'patrol';
        this.justRespawned = true; // Set the justRespawned flag

        // Reset the justRespawned flag after a short delay
        setTimeout(() => {
            this.justRespawned = false;
        }, 20000); // Adjust the delay as needed

    }

    draw(ctx, camera) {
        if (this.image && this.image.complete && this.image.naturalWidth !== 0) {
            ctx.drawImage(this.image, this.x - camera.x, this.y - camera.y, this.width, this.height); // Offset by camera's x and y
        } else {
            ctx.fillStyle = 'red';
            ctx.fillRect(this.x - camera.x, this.y - camera.y, this.width, this.height); // Offset by camera's x and y
        }

        // Draw debug box if debug mode is enabled
        if (this.debugMode) {
            this.drawDebugBox(ctx, camera);
        }
    }

    drawDebugBox(ctx, camera) {
        const boundingBox = this.getBoundingBox();
        const boxX = this.patrolDirection === 'right'
            ? boundingBox.right
            : boundingBox.left - this.seeDistance;
        const boxY = boundingBox.top;
        const boxWidth = this.seeDistance;
        const boxHeight = boundingBox.bottom - boundingBox.top;

        // Scanning box
        ctx.strokeStyle = 'yellow';
        ctx.lineWidth = 2;
        ctx.strokeRect(boxX - camera.x, boxY - camera.y, boxWidth, boxHeight);

        // Draw the sensor for checking if there is a platform below the next position
        const nextX = (this.patrolDirection === "right") ? this.x + this.speed : this.x - this.speed;
        const sensorX = (this.patrolDirection === "right") ? nextX + this.width + this.sensorXOffset : nextX + this.sensorXOffset;
        const sensorY = this.y + this.height - this.sensorYOffset;

        ctx.strokeStyle = 'red';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(sensorX - camera.x, sensorY - camera.y);
        ctx.lineTo(sensorX - camera.x, sensorY - camera.y + 10); // Draw a short line downwards
        ctx.stroke();

        // Draw the sensor for checking if there is a wall in front of the enemy
        const wallSensorX = (this.patrolDirection === "right") ? this.x + this.width + this.speed : this.x - this.speed;
        const wallSensorY = this.y + this.height / 2;

        ctx.strokeStyle = 'blue';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(wallSensorX - camera.x, wallSensorY - camera.y);
        ctx.lineTo(wallSensorX - camera.x + 10, wallSensorY - camera.y); // Draw a short line to the right
        ctx.stroke();
    }

    checkCollision(player) {
        const boundingBox = this.getBoundingBox();
        return player.x + player.width > boundingBox.left &&
            player.x < boundingBox.right &&
            player.y + player.height > boundingBox.top &&
            player.y < boundingBox.bottom;
    }

    getBoundingBox() {
        if (!this.boundingBox) {
            return { left: this.x, right: this.x + this.width, top: this.y, bottom: this.y + this.height };
        }
        const { left, right, top, bottom } = this.boundingBox;
        return {
            left: this.x + left,
            right: this.x + right,
            top: this.y + top,
            bottom: this.y + bottom
        };
    }

    getPlatformAt(x, y, platforms) {
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

    update(player, platforms) {
        if (this.mode === 'patrol') {
            this.patrol(platforms, player);
        } else if (this.mode === 'hunter') {
            this.hunt(player);
        } else if (this.mode === 'pausePatrol') {
            // Do nothing, just wait for the timeout to end
        }

        // Ensure animations are loaded before updating the frame
        if (!this.animations[this.state]) {
            return;
        }

        // Update the animation frame
        this.tickCount++;
        if (this.tickCount > this.ticksPerFrame) {
            this.tickCount = 0;
            this.frameIndex = (this.frameIndex + 1) % this.animations[this.state].length;
            if (this.animations[this.state][this.frameIndex]) {
                this.image = this.animations[this.state][this.frameIndex].image;
                this.boundingBox = this.animations[this.state][this.frameIndex].boundingBox;
            } else {
                console.error('Failed to update frame: Invalid frame index');
            }
        }

    }

    hunt(player) {
        const distanceToPlayer = Math.hypot(player.x - this.x, player.y - this.y);

        if (distanceToPlayer < this.chaseRange) {
            const angle = Math.atan2(player.y - this.y, player.x - this.x);
            this.x += Math.cos(angle) * this.speed;
            this.y += Math.sin(angle) * this.speed;
        } else {
            const tolerance = 1;
            const distanceToStart = Math.hypot(this.startX - this.x, this.startY - this.y);

            if (distanceToStart > tolerance) {
                const angle = Math.atan2(this.startY - this.y, this.startX - this.x);
                this.x += Math.cos(angle) * this.speed;
                this.y += Math.sin(angle) * this.speed;
            } else {
                this.x = this.startX;
                this.y = this.startY;
            }
        }
    }

    scanForPlayer(player, scanDistance) {
        const boundingBox = this.getBoundingBox();
        const boxX = this.patrolDirection === 'right'
            ? boundingBox.right
            : boundingBox.left - scanDistance;
        const boxY = boundingBox.top;
        const boxWidth = scanDistance;
        const boxHeight = boundingBox.bottom - boundingBox.top;

        const adjustedBoxX = boxX - this.camera.x;
        const adjustedBoxY = boxY - this.camera.y;
        const adjustedPlayerX = player.x - this.camera.x;
        const adjustedPlayerY = player.y - this.camera.y;

        const playerInRange = adjustedPlayerX + player.width > adjustedBoxX && adjustedPlayerX < adjustedBoxX + boxWidth;
        const playerYInRange = adjustedPlayerY > adjustedBoxY && adjustedPlayerY < adjustedBoxY + boxHeight;
        const canSeePlayer = playerInRange && playerYInRange;

        if (this.debugMode) console.log("canSeePlayer", canSeePlayer, "canAttack", this.canAttack);
        if (this.debugMode) console.log("patrolDirection", this.patrolDirection, "state", this.state);

        if (this.canAttack && canSeePlayer) {
            this.speed = this.aggroSpeed;

            // This is a hack to prevent none projectile from walking backwards when respawning
            if (this.useProjectile) {
                this.setState(this.patrolDirection === 'right' ? 'attack_right' : 'attack_left', this.state);
            }
            else {
                this.setState(this.patrolDirection === 'right' ? 'attack_right' : 'attack_left');
            }

            if (this.useProjectile) {
                this.fireProjectile();
            }
            this.canAttack = false; // Set useProjectile to false to start cooldown
            setTimeout(() => {
                this.speed = this.restoreSpeed;
                this.canAttack = true; // Reset useProjectile after cooldown
                if (this.debugMode) console.log("canAttack", canAttack);
            }, this.projectileReloadTime); // Use projectileReloadTime for cooldown
        }
    }

    fireProjectile() {
        // Calculate the projectile's starting x position based on the patrol direction and bounding box
        const boundingBox = this.getBoundingBox();
        const projectileXOffset = (this.patrolDirection === "right") ? boundingBox.right : boundingBox.left - this.projectileImage.width;
        const projectileYPosition = boundingBox.top + (boundingBox.bottom - boundingBox.top) / 2 - this.projectileYOffset;

        // Create a new projectile and add it to the projectiles array
        const projectile = new Projectile(projectileXOffset - this.camera.x, projectileYPosition - this.camera.y, this.patrolDirection, this.projectileSpeed, 500, this.projectileImage, this.projectileBoundingBox);
        this.projectiles.push(projectile);

        // Notify the higher-level component or manager about the projectile firing event
        if (this.onFireProjectile) {
            this.onFireProjectile(projectile);
        }
    }

    patrol(platforms, player) {
        const nextX = (this.patrolDirection === "right") ? this.x + this.speed : this.x - this.speed;
        const sensorX = (this.patrolDirection === "right") ? nextX + this.width + this.sensorXOffset : nextX + this.sensorXOffset;
        const sensorY = this.y + this.height - this.sensorYOffset;

        // Check if there is a platform below the next position
        if (!this.getPlatformAt(sensorX, sensorY, platforms)) {
            if (this.mode !== 'pausePatrol' && !this.justRespawned) {
                this.patrolDirection = (this.patrolDirection === "right") ? "left" : "right";
                this.setState((this.patrolDirection === "right") ? "idle_right" : "idle_left");
                this.mode = 'pausePatrol';

                this.pauseTimeout = setTimeout(() => {
                    this.mode = 'patrol';
                    this.setState((this.patrolDirection === "right") ? "walk_right" : "walk_left");
                    this.pauseTimeout = null;
                }, this.idleTime); // Enemy will pause for idleTime milliseconds
            }
            return;
        }

        // Check if there is a wall in front of the enemy
        const wallSensorX = (this.patrolDirection === "right") ? this.x + this.width + this.speed : this.x - this.speed;
        const wallSensorY = this.y + this.height / 2;

        if (this.getPlatformAt(wallSensorX, wallSensorY, platforms)) {

            if (this.debugMode) console.log("Wall detected, mode:", this.mode);

            if (this.mode !== 'pausePatrol') {
                this.patrolDirection = (this.patrolDirection === "right") ? "left" : "right";
                this.setState((this.patrolDirection === "right") ? "idle_right" : "idle_left");
                this.mode = 'pausePatrol';

                this.pauseTimeout = setTimeout(() => {
                    this.mode = 'patrol';
                    this.setState((this.patrolDirection === "right") ? "walk_right" : "walk_left");
                    this.pauseTimeout = null;
                }, this.idleTime); // Enemy will pause for idleTime milliseconds
            }
            return;
        }

        // Scan for player
        this.scanForPlayer(player, this.seeDistance);

        this.x = nextX;
    }
}
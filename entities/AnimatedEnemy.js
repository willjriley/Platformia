import Projectile from './Projectile.js';

export default class AnimatedEnemy {
    constructor(x, y, platform, mode = 'patrol', onFireProjectile) {
        this.x = x;
        this.y = y;
        this.startX = x; // Store the starting position for Hunter mode
        this.startY = y;
        this.width = null;
        this.height = null;
        this.idleTime = 0; // Time the enemy will stand idle before resuming patrol
        this.platform = platform; // Store the platform on which the enemy is patrolling
        this.patrolDirection = 'right'; // Direction the enemy is patrolling
        this.speed = .8; // Patrol speed
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
        this.lastFireTime = 0; // Timestamp of the last projectile fire
        this.useProjectile = false; // Flag to indicate if the enemy uses projectiles
        this.seeDistance = 1; // Distance at which the enemy can see the player
        this.projectileBoundingBox = null;

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
            const response = await fetch('/assets/fantasy/beholder/animate.json');
            const data = await response.json();
            data.states.forEach(state => {
                this.animations[state.state] = state.frames.map(frame => ({
                    image: this.loadImage(frame.src),
                    boundingBox: frame.boundingBox
                }));
            });

            // Load the projectile image
            this.projectileImage = await this.loadImage(data.projectileImage);
            this.width = data.width;
            this.height = data.height;
            this.idleTime = data.idleTime;
            this.projectileYOffset = data.projectileYOffset;
            this.projectileSpeed = data.projectileSpeed;
            this.projectileReloadTime = data.projectileReloadTime;
            this.useProjectile = data.useProjectile;
            this.seeDistance = data.seeDistance;
            this.projectileBoundingBox = data.projectileBoundingBox;

            // Set the initial state and frame after loading animations
            this.state = data.default;
            if (this.animations[this.state] && this.animations[this.state][0]) {
                this.image = this.animations[this.state][this.frameIndex].image;
                this.boundingBox = this.animations[this.state][this.frameIndex].boundingBox;
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

    setState(state) {
        if (this.animations[state]) {
            this.state = state;
            this.frameIndex = 0;
            if (this.animations[this.state][0]) {
                this.image = this.animations[this.state][this.frameIndex].image;
                this.boundingBox = this.animations[this.state][this.frameIndex].boundingBox;
                console.log(`State set to ${state}`);
            } else {
                console.error('Failed to set state: Invalid frames');
            }
        } else {
            console.error('Failed to set state: Invalid state');
        }
    }

    respawn() {
        this.x = this.startX;
        this.y = this.startY;
        this.patrolDirection = 'right';
        this.setState(this.patrolDirection === "right" ? "walk_right" : "walk_left");
        this.frameIndex = 0;
        this.tickCount = 0;

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
        }, 1000); // Adjust the delay as needed
    }

    draw(ctx, camera) {
        if (this.image && this.image.complete && this.image.naturalWidth !== 0) {
            ctx.drawImage(this.image, this.x - camera.x, this.y - camera.y, this.width, this.height); // Offset by camera's x and y
        } else {
            ctx.fillStyle = 'red';
            ctx.fillRect(this.x - camera.x, this.y - camera.y, this.width, this.height); // Offset by camera's x and y
        }
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
        const playerInRange = this.patrolDirection === 'right'
            ? player.x > this.x && player.x < this.x + scanDistance
            : player.x < this.x && player.x > this.x - scanDistance;

        const playerYInRange = player.y > this.startY && player.y < this.startY + this.height;

        if (playerInRange && playerYInRange && this.useProjectile) {
            this.setState(this.patrolDirection === 'right' ? 'attack_right' : 'attack_left');
            this.fireProjectile();
            this.useProjectile = false; // Set useProjectile to false to start cooldown
            setTimeout(() => {
                this.setState(this.patrolDirection === 'right' ? 'walk_right' : 'walk_left');
                this.useProjectile = true; // Reset useProjectile after cooldown
            }, this.projectileReloadTime); // Use projectileReloadTime for cooldown
        }
    }

    fireProjectile() {
        const currentTime = Date.now();
        if (currentTime - this.lastFireTime < this.projectileReloadTime) {
            return; // Not enough time has passed since the last fire
        }
        this.lastFireTime = currentTime;

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

        // Set the state to attack
        this.setState(this.patrolDirection === 'right' ? 'attack_right' : 'attack_left');

        // Calculate the duration of the attack animation
        const attackAnimationDuration = this.animations[this.state].length * this.ticksPerFrame * (1000 / 60); // Assuming 60 FPS

        // Set a timeout to switch back to the walking state after the attack animation completes
        setTimeout(() => {
            this.setState(this.patrolDirection === 'right' ? 'walk_right' : 'walk_left');
        }, attackAnimationDuration);
    }

    patrol(platforms, player) {
        const nextX = (this.patrolDirection === "right") ? this.x + this.speed : this.x - this.speed;
        const sensorX = (this.patrolDirection === "right") ? nextX + this.width : nextX;
        const sensorY = this.y + this.height + 1;

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
                }, 5000); // Pause for 5 seconds
            }
            return;
        }

        // Check if there is a wall in front of the enemy
        const wallSensorX = (this.patrolDirection === "right") ? this.x + this.width + this.speed : this.x - this.speed;
        const wallSensorY = this.y + this.height / 2;

        if (this.getPlatformAt(wallSensorX, wallSensorY, platforms)) {
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

        // Scan for player
        this.scanForPlayer(player, this.seeDistance);

        this.x = nextX;
    }
}
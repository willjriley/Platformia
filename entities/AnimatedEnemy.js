export default class AnimatedEnemy {
    constructor(x, y, platform, mode = 'patrol', width = 128, height = 128, tileSize = 128) {
        this.x = x;
        this.y = y;
        this.startX = x; // Store the starting position for Hunter mode
        this.startY = y;
        this.width = width;
        this.height = height;
        this.platform = platform; // Store the platform on which the enemy is patrolling
        this.patrolDirection = 'right'; // Direction the enemy is patrolling
        this.speed = 1; // Patrol speed
        this.mode = mode; // mode of enemy: 'patrol' or 'hunter'
        this.chaseRange = 250; // Range within which the Hunter chases the player
        this.tileSize = tileSize;

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
        console.log('Respawning enemy');
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


    }

    draw(ctx, camera) {
        if (this.image) {
            ctx.drawImage(this.image, this.x - camera.x, this.y, this.width, this.height); // Offset by camera's x
        } else {
            ctx.fillStyle = 'red';
            ctx.fillRect(this.x - camera.x, this.y, this.width, this.height); // Offset by camera's x
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
            this.patrol(platforms);
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

    patrol(platforms) {
        const nextX = (this.patrolDirection === "right") ? this.x + this.speed : this.x - this.speed;
        const sensorX = (this.patrolDirection === "right") ? nextX + this.width : nextX;
        const sensorY = this.y + this.height + 1;

        // Check if there is a platform below the next position
        if (!this.getPlatformAt(sensorX, sensorY, platforms)) {
            this.patrolDirection = (this.patrolDirection === "right") ? "left" : "right";
            this.setState((this.patrolDirection === "right") ? "idle_right" : "idle_left");
            this.mode = 'pausePatrol';
            setTimeout(() => {
                this.mode = 'patrol';
                this.setState((this.patrolDirection === "right") ? "walk_right" : "walk_left");
            }, 10000); // Pause for 10 seconds
            return;
        }

        // Check if there is a wall in front of the enemy
        const wallSensorX = (this.patrolDirection === "right") ? this.x + this.width + this.speed : this.x - this.speed;
        const wallSensorY = this.y + this.height / 2;

        if (this.getPlatformAt(wallSensorX, wallSensorY, platforms)) {
            this.patrolDirection = (this.patrolDirection === "right") ? "left" : "right";
            this.setState((this.patrolDirection === "right") ? "idle_right" : "idle_left");
            this.mode = 'pausePatrol';
            setTimeout(() => {
                this.mode = 'patrol';
                this.setState((this.patrolDirection === "right") ? "walk_right" : "walk_left");
            }, 10000); // Pause for 10 seconds
            return;
        }

        this.x = nextX;
    }
}
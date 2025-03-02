export default class Enemy {
    constructor(x, y, image, platform, type = 'patrol', width = 32, height = 32, tileSize) {
        this.x = x;
        this.y = y;
        this.startX = x; // Store the starting position for Hunter type
        this.startY = y;
        this.width = width;
        this.height = height;
        this.image = image || null; // Optional image
        this.platform = platform; // Store the platform on which the enemy is patrolling
        this.patrolDirection = 'right'; // Direction the enemy is patrolling
        this.speed = 1; // Patrol speed
        this.type = type; // Type of enemy: 'patrol' or 'hunter'
        this.chaseRange = 250; // Range within which the Hunter chases the player
        this.ctx = ctx;
        this.camera = camera;
        this.tileSize = 32;
    }

    respawn() {
        this.x = this.startX;
        this.y = this.startY;
    }

    draw(ctx, camera) {
        if (this.image) {
            ctx.drawImage(this.image, 0, 0, this.tileSize, this.tileSize, this.x - camera.x, this.y, this.width, this.height); // Offset by camera's x
        } else {
            ctx.fillStyle = 'red';
            ctx.fillRect(this.x - this.camera.x, this.y, this.width, this.height); // Offset by camera's x
        }
    }

    patrol(platforms) {
        // Determine the next horizontal position based on the current direction
        const nextX = (this.patrolDirection === "right") ? this.x + this.speed : this.x - this.speed;

        // Sensor point at the enemy's feet in the direction of movement.
        // If moving right, check the right edge; if left, check the left edge.
        const sensorX = (this.patrolDirection === "right") ? nextX + this.width : nextX;
        const sensorY = this.y + this.height + 1; // 1 pixel below the enemy's feet

        // Check for a gap: if there is no platform beneath the sensor point, then reverse direction.
        if (!this.getPlatformAt(sensorX, sensorY, platforms)) {
            this.patrolDirection = (this.patrolDirection === "right") ? "left" : "right";
            return; // Skip moving this frame.
        }

        // Check for a wall: place a sensor at about the enemy's mid-height in front.
        const wallSensorX = (this.patrolDirection === "right") ? this.x + this.width + this.speed : this.x - this.speed;
        const wallSensorY = this.y + this.height / 2;
        if (this.getPlatformAt(wallSensorX, wallSensorY, platforms)) {
            // There is an obstacle directly in front.
            this.patrolDirection = (this.patrolDirection === "right") ? "left" : "right";
            return;
        }

        // If both sensors are clear, move the enemy.
        this.x = nextX;
    }

    checkCollision(player) {
        return player.x + player.width > this.x &&
            player.x < this.x + this.width &&
            player.y + player.height > this.y &&
            player.y < this.y + this.height

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
        if (this.type === 'patrol') {
            this.patrol(platforms);
        } else if (this.type === 'hunter') {
            this.hunt(player);
        }
    }

    hunt(player) {
        const distanceToPlayer = Math.hypot(player.x - this.x, player.y - this.y);

        if (distanceToPlayer < this.chaseRange) {
            // Move towards the player
            const angle = Math.atan2(player.y - this.y, player.x - this.x);
            this.x += Math.cos(angle) * this.speed;
            this.y += Math.sin(angle) * this.speed;
        } else {
            // Return to the starting position
            const tolerance = 1; // Tolerance range to avoid jittering
            const distanceToStart = Math.hypot(this.startX - this.x, this.startY - this.y);

            if (distanceToStart > tolerance) {
                const angle = Math.atan2(this.startY - this.y, this.startX - this.x);
                this.x += Math.cos(angle) * this.speed;
                this.y += Math.sin(angle) * this.speed;
            } else {
                // Stop moving if within the tolerance range
                this.x = this.startX;
                this.y = this.startY;
            }
        }
    }
}
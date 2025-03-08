export default class Platform {
    constructor(x, y, width, height, image, type, level, color, force, deadly = false, moveSpeed = 0, moveDirection = 'horizontal', moveRange = 0, fallDelay = 0, canFall = false, canRumble = false, rumbleDelay = 2, rotationSpeed = 0.01) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.image = image || null;
        this.type = type;
        this.level = level || null;
        this.color = color;
        this.force = force || 1;
        this.deadly = deadly;

        // Movement properties
        this.moveSpeed = typeof moveSpeed === 'string' ? parseFloat(moveSpeed) : moveSpeed;
        this.moveDirection = moveDirection;
        this.moveRange = moveRange;
        this.startX = x;
        this.startY = y;
        this.movingForward = true;

        // Falling properties
        this.fallDelay = typeof fallDelay === 'string' ? parseFloat(fallDelay) * 1000 : fallDelay * 1000; // Convert delay to milliseconds
        this.fallStartTime = null;
        this.falling = false;
        this.canFall = canFall; // Indicates if the platform can fall

        // Rumble properties
        this.canRumble = canFall;
        this.rumbleDelay = rumbleDelay * 1000; // Convert delay to milliseconds
        this.lastRumbleTime = Date.now();

        // Rotation properties
        this.rotation = 0;
        this.rotationDirection = 1; // 1 for clockwise, -1 for counter-clockwise
        this.rotationSpeed = rotationSpeed;
    }

    update(player) {
        // Handle movement
        let deltaX = 0;
        let deltaY = 0;

        if (this.moveSpeed > 0 && this.moveRange > 0) {
            if (this.moveDirection === 'horizontal') {
                if (this.movingForward) {
                    deltaX = this.moveSpeed;
                    this.x += deltaX;
                    if (this.x >= this.startX + this.moveRange) {
                        this.movingForward = false;
                    }
                } else {
                    deltaX = -this.moveSpeed;
                    this.x += deltaX;
                    if (this.x <= this.startX) {
                        this.movingForward = true;
                    }
                }
            } else if (this.moveDirection === 'vertical') {
                if (this.movingForward) {
                    deltaY = this.moveSpeed;
                    this.y += deltaY;
                    if (this.y >= this.startY + this.moveRange) {
                        this.movingForward = false;
                    }
                } else {
                    deltaY = -this.moveSpeed;
                    this.y += deltaY;
                    if (this.y <= this.startY) {
                        this.movingForward = true;
                    }
                }
            }
        }

        // Move the player with the platform if they are standing on it
        let playerOnPlatform = false;
        if (player.x < this.x + this.width &&
            player.x + player.width > this.x &&
            player.y + player.height >= this.y &&
            player.y + player.height <= this.y + this.height) {
            player.x += deltaX;
            player.y += deltaY;
            playerOnPlatform = true;
        }

        // Handle falling
        if (this.canFall) {
            if (this.falling) {
                this.y += this.moveSpeed; // Use moveSpeed as fall speed
            } else if (this.fallDelay > 0) {
                // Check if the player is standing on the platform
                if (playerOnPlatform) {
                    if (this.fallStartTime === null) {
                        this.fallStartTime = Date.now(); // Start the fall timer
                    }
                    if (Date.now() - this.fallStartTime >= this.fallDelay) {
                        this.falling = true;
                    }
                } else {
                    this.fallStartTime = null; // Reset the fall timer if the player is not on the platform
                }
            }
        }

        // Handle rumble effect (rotation) only when the player is on the platform
        if (this.canRumble && playerOnPlatform) {
            this.rotation += this.rotationSpeed * this.rotationDirection;
            if (Math.abs(this.rotation) >= 0.05) { // Limit the rotation angle
                this.rotationDirection *= -1; // Reverse the rotation direction
            }
        } else {
            this.rotation = 0; // Reset rotation when the player is not on the platform
        }
    }

    draw(ctx, camera) {
        ctx.save();
        ctx.translate(this.x + this.width / 2 - camera.x, this.y + this.height / 2);
        ctx.rotate(this.rotation);
        ctx.translate(-(this.x + this.width / 2 - camera.x), -(this.y + this.height / 2));

        if (this.color) {
            if (String(this.color).toLowerCase() === "transparent") {
                ctx.restore();
                return;
            }
            ctx.fillStyle = this.color;
            ctx.fillRect(this.x - camera.x, this.y, this.width, this.height);
        }
        if (this.image) {
            ctx.drawImage(this.image, 0, 0, tileSize, tileSize, this.x - camera.x, this.y, this.width, this.height);
        }

        ctx.restore();
    }
}
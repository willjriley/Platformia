// Platform object
function Platform(x, y, width, height, image, type, script, color, force, deadly = false, moveSpeed = 0, moveDirection = 'horizontal', moveRange = 0, fallDelay = 0, canFall = false) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.image = image || null;
    this.type = type;
    this.script = script || null;
    this.color = color;
    this.force = force || 1;
    this.deadly = deadly;

    // Movement properties
    this.moveSpeed = moveSpeed;
    this.moveDirection = moveDirection;
    this.moveRange = moveRange;
    this.startX = x;
    this.startY = y;
    this.movingForward = true;

    // Falling properties
    this.fallDelay = fallDelay * 1000; // Convert delay to milliseconds
    this.fallStartTime = null;
    this.falling = false;
    this.canFall = canFall; // Indicates if the platform can fall
}

Platform.prototype.update = function (player) {
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
    if (player.x < this.x + this.width &&
        player.x + player.width > this.x &&
        player.y + player.height >= this.y &&
        player.y + player.height <= this.y + this.height) {
        player.x += deltaX;
        player.y += deltaY;
    }

    // Handle falling
    if (this.canFall) {
        if (this.falling) {
            this.y += this.moveSpeed; // Use moveSpeed as fall speed
        } else if (this.fallDelay > 0) {
            // Check if the player is standing on the platform
            if (player.x < this.x + this.width &&
                player.x + player.width > this.x &&
                player.y + player.height >= this.y &&
                player.y + player.height <= this.y + this.height) {
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
}

Platform.prototype.draw = function () {
    if (this.color) {
        if (String(this.color).toLowerCase() === "transparent") {
            return;
        }
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x - camera.x, this.y, this.width, this.height);
    }
    if (this.image) {
        ctx.drawImage(this.image, 0, 0, tileSize, tileSize, this.x - camera.x, this.y, this.width, this.height);
    }
}
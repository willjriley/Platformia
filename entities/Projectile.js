export default class Projectile {
    constructor(x, y, direction, speed = 200, range = 500, image = null, boundingBox) {
        this.x = x;
        this.y = y;
        this.direction = direction;
        this.speed = speed;
        this.range = range;
        this.distanceTraveled = 0;
        this.width = 128;
        this.height = 128;
        this.active = true;
        this.image = image;
        this.boundingBox = boundingBox;
        this.lastUpdateTime = Date.now();
    }

    update() {
        const now = Date.now();
        const deltaTime = (now - this.lastUpdateTime) / 1000; // Convert to seconds
        this.lastUpdateTime = now;

        const distance = this.speed * deltaTime;

        if (this.direction === 'right') {
            this.x += distance;
        } else {
            this.x -= distance;
        }
        this.distanceTraveled += distance;

        // Deactivate the projectile if it exceeds its range
        if (this.distanceTraveled >= this.range) {
            this.active = false;
        }
    }

    draw(ctx, camera) {
        if (this.image) {
            const boundingBox = this.getBoundingBox();
            ctx.drawImage(this.image, this.x - camera.x, this.y - camera.y, this.boundingBox.right, this.image.height - camera.y); // Offset by camera's x and y
        } else {
            ctx.fillStyle = 'yellow';
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

}
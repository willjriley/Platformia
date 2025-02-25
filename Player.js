export default class Player {
    constructor(x, y, mapData, height, gravity) {
        this.x = x || 50;
        this.y = y || 544;
        this.width = 32;
        this.height = 32;
        this.speed = 3;
        this.velocityX = 0;
        this.velocityY = 0;
        this.jumpPower = -8;
        this.color = 'blue';
        this.isJumping = false;
        this.image = new Image();
        this.image.src = "./assets/player1.png";
        this.facing = "right"; // default facing direction
        this.tileSize = 32;
        this.mapData = mapData;
        this.height = height;
        this.gravity = gravity;
    }

    draw(ctx, camera) {
        ctx.save();

        let drawX = this.x - camera.x;
        let drawY = this.y;

        // dynamic flip of image
        if (this.facing === "left") {
            ctx.translate(drawX + this.width, drawY);
            ctx.scale(-1, 1);
            ctx.drawImage(this.image, 0, 0, this.tileSize, this.tileSize, 0, 0, this.width, this.height);
        } else {
            ctx.translate(drawX, drawY);
            ctx.drawImage(this.image, 0, 0, this.tileSize, this.tileSize, 0, 0, this.width, this.height);
        }

        ctx.restore();
    }

    move() {
        // Apply gravity with a maximum fall speed
        if (this.isJumping) {
            this.velocityY = Math.min(this.velocityY + this.gravity, 15);
        }

        // Predict next position
        let nextX = this.x + this.velocityX;
        let nextY = this.y + this.velocityY;

        // Apply movement with bounds checking
        this.x = Math.max(0, Math.min(nextX, mapData[0].length * tileSize - this.width));
        this.y = Math.max(0, Math.min(nextY, height - this.height));


        // Reset jumping if we hit the ground
        if (this.y === this.height - this.height) {
            this.isJumping = false;
            this.velocityY = 0;
        }
    }

    bounce(force, direction) {
        if (direction === 'vertical') {
            this.velocityY = -force;
        } else if (direction === 'horizontal') {
            this.velocityX = -force;
        }
    }
}
// Player object
function Player(x, y) {
    this.x = x || 50;
    this.y = y || 544;
    this.width = 32;
    this.height = 32;
    this.speed = 3;
    this.velocityX = 0;
    this.velocityY = 0;
    this.jumpPower = -11;
    this.color = 'blue';
    this.isJumping = false;
    this.image = new Image();
    this.image.src = "assets/player1.png";
    this.facing = "right"; // default facing direction
}

Player.prototype.draw = function () {
    ctx.save();

    let drawX = this.x - camera.x;
    let drawY = this.y;

    // dynamic flip of image
    if (this.facing === "left") {
        ctx.translate(drawX + this.width, drawY);
        ctx.scale(-1, 1);
        ctx.drawImage(this.image, 0, 0, tileSize, tileSize, 0, 0, this.width, this.height);
    } else {
        ctx.translate(drawX, drawY);
        ctx.drawImage(this.image, 0, 0, tileSize, tileSize, 0, 0, this.width, this.height);
    }

    ctx.restore();
};

Player.prototype.move = function () {
    if (this.isJumping && this.velocityY < 15) {
        this.velocityY += gravity; // Apply gravity
    }

    // Apply horizontal velocity
    if (this.velocityX !== 0) {
        this.x += this.velocityX;
    }

    // Apply vertical velocity
    this.y += this.velocityY;

    // Prevent player from going out of bounds (vertically)
    if (this.y + this.height >= height) {
        this.y = height - this.height;
        this.velocityY = 0;
        this.isJumping = false;
    }

    // Prevent player from jumping outside the top of the canvas
    if (this.y < 0) {
        this.y = 0;
        this.velocityY = 0;
    }
};

function SpinningRope(x, y, length = 128, color, image, spinRate = 0.05) {
    this.x = x;
    this.y = y;
    this.length = length;
    this.color = color;
    this.image = image ? new Image() : null;
    if (this.image) {
        this.image.src = image;
    }
    this.angle = 0;
    this.rotationSpeed = typeof spinRate === 'string' ? parseFloat(spinRate) : spinRate;
}

SpinningRope.prototype.update = function () {
    this.angle += this.rotationSpeed;
}

SpinningRope.prototype.draw = function (ctx, camera) {
    ctx.save();
    ctx.translate(this.x - camera.x, this.y - camera.y);
    if (this.image) {
        ctx.drawImage(this.image, -this.image.width / 2, -this.image.height / 2);
    }
    ctx.rotate(this.angle);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(this.length, 0);
    ctx.strokeStyle = this.color;
    ctx.lineWidth = 5; // Adjust the line width as needed
    ctx.stroke();
    ctx.restore();
}

SpinningRope.prototype.checkCollision = function (player) {
    // Check collision along the entire length of the rope
    for (let i = 0; i <= this.length; i += 5) { // Check every 5 pixels along the rope
        const ropeSegmentX = this.x + Math.cos(this.angle) * i;
        const ropeSegmentY = this.y + Math.sin(this.angle) * i;
        const distance = Math.hypot(player.x + player.width / 2 - ropeSegmentX, player.y + player.height / 2 - ropeSegmentY);
        if (distance < player.width / 2) { // Adjust the collision detection as needed
            return true;
        }
    }
    return false;
}
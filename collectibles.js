// Collectible object
function Collectible(x, y, image, width = 32, height = 32) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.image = image || null;
}

Collectible.prototype.draw = function () {
    if (this.image) {
        ctx.drawImage(this.image, 0, 0, tileSize, tileSize, this.x - camera.x, this.y, this.width, this.height); // Offset by camera's x
    } else {
        ctx.fillStyle = 'yellow';
        ctx.fillRect(this.x - camera.x, this.y, this.width, this.height); // Offset by camera's x
    }
};

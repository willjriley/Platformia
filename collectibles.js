// Collectible object
function Collectible(x, y, image) {
    this.x = x;
    this.y = y;
    this.width = 32;
    this.height = 32;
    this.image = image || null; // Optional image
}

Collectible.prototype.draw = function() {
    if (this.image) {
        ctx.drawImage(this.image, 0, 0, tileSize, tileSize, this.x - camera.x, this.y, this.width, this.height); // Offset by camera's x
    } else {
        ctx.fillStyle = 'yellow';
        ctx.fillRect(this.x - camera.x, this.y, this.width, this.height); // Offset by camera's x
    }
};

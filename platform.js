// Platform object
function Platform(x, y, width, height, image, type, script, color) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.image = image || null; // Optional image
    this.type = type;
    this.script = script || null;
    this.color = color;
}

Platform.prototype.draw = function() {
    if (this.image) {
        ctx.drawImage(this.image, 0, 0, tileSize, tileSize, this.x - camera.x, this.y, this.width, this.height); // Offset by camera's x
    } else {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x - camera.x, this.y, this.width, this.height); // Offset by camera's x
    }
};

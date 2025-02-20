// Platform object
function Platform(x, y, width, height, image, type, script, color, force, deadly = false) {
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
};

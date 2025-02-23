function Spikes(x, y, width, height, color, riseRate = 0.5, delay = 2) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;
    this.riseRate = riseRate;
    this.currentHeight = 15;
    this.extended = true;
    this.delay = delay * 1000; // Convert delay to milliseconds
    this.lastToggleTime = Date.now(); // Track the last time the spikes were toggled
}

Spikes.prototype.update = function () {
    const currentTime = Date.now();
    if (currentTime - this.lastToggleTime < this.delay) {
        return; // Exit the update method until the delay is over
    }

    if (this.extended) {
        this.currentHeight += this.riseRate;
        if (this.currentHeight >= this.height) {
            this.currentHeight = this.height;
            this.extended = false; // Start retracting
            this.lastToggleTime = currentTime; // Reset the toggle time
        }
    } else {
        this.currentHeight -= this.riseRate;
        if (this.currentHeight <= 0) {
            this.currentHeight = 0;
            this.extended = true; // Start extending
            this.lastToggleTime = currentTime; // Reset the toggle time
        }
    }

}

Spikes.prototype.draw = function (ctx, camera) {
    ctx.save();
    ctx.translate(this.x - camera.x, this.y - camera.y);
    ctx.fillStyle = this.color;
    ctx.beginPath();
    for (let i = 0; i < this.width; i += 10) {
        ctx.moveTo(i, 0);
        ctx.lineTo(i + 5, -this.currentHeight);
        ctx.lineTo(i + 10, 0);
    }
    ctx.closePath();
    ctx.fill();
    ctx.restore();
}

Spikes.prototype.checkCollision = function (player) {
    if (this.currentHeight > 0) {
        const playerBottom = player.y + player.height;
        const spikeTop = this.y - this.currentHeight;
        if (player.x < this.x + this.width &&
            player.x + player.width > this.x &&
            playerBottom > spikeTop &&
            player.y < this.y) {
            return true;
        }
    }
    return false;
}

Spikes.prototype.toggleExtended = function () {
    this.extended = !this.extended;
    this.lastToggleTime = Date.now(); // Reset the toggle time when toggling the extended state
}
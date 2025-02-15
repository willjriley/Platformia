// Enemy object
function Enemy(x, y, image, platform) {
    this.x = x;
    this.y = y;
    this.width = 32;
    this.height = 32;
    this.image = image || null; // Optional image
    this.platform = platform; // Store the platform on which the enemy is patrolling
    this.patrolDirection = 'right'; // Direction the enemy is patrolling
    this.speed = .5; // Patrol speed
}

Enemy.prototype.draw = function () {
    if (this.image) {
        ctx.drawImage(this.image, 0, 0, tileSize, tileSize, this.x - camera.x, this.y, this.width, this.height); // Offset by camera's x
    } else {
        ctx.fillStyle = 'red';
        ctx.fillRect(this.x - camera.x, this.y, this.width, this.height); // Offset by camera's x
    }
};

Enemy.prototype.patrol = function () {
    // Determine the next horizontal position based on the current direction
    const nextX = (this.patrolDirection === "right") ? this.x + this.speed : this.x - this.speed;

    // Sensor point at the enemy's feet in the direction of movement.
    // If moving right, check the right edge; if left, check the left edge.
    const sensorX = (this.patrolDirection === "right") ? nextX + this.width : nextX;
    const sensorY = this.y + this.height + 1; // 1 pixel below the enemy's feet

    // Check for a gap: if there is no platform beneath the sensor point, then reverse direction.
    if (!getPlatformAt(sensorX, sensorY)) {
        this.patrolDirection = (this.patrolDirection === "right") ? "left" : "right";
        return; // Skip moving this frame.
    }

    // Check for a wall: place a sensor at about the enemy's mid-height in front.
    const wallSensorX = (this.patrolDirection === "right") ? this.x + this.width + this.speed : this.x - this.speed;
    const wallSensorY = this.y + this.height / 2;
    if (getPlatformAt(wallSensorX, wallSensorY)) {
        // There is an obstacle directly in front.
        this.patrolDirection = (this.patrolDirection === "right") ? "left" : "right";
        return;
    }

    // If both sensors are clear, move the enemy.
    this.x = nextX;
};

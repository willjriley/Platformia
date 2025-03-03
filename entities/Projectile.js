export default class Projectile {
    constructor(x, y, direction, speed = 5, range = 500) {
        this.x = x;
        this.y = y;
        this.direction = direction;
        this.speed = speed;
        this.range = range;
        this.distanceTraveled = 0;
        this.width = 10;
        this.height = 10;
        this.active = true;
        console.log('Projectile created');
    }

    update() {
        console.log('Projectile updated');
        if (this.direction === 'right') {
            this.x += this.speed;
        } else {
            this.x -= this.speed;
        }
        this.distanceTraveled += this.speed;

        // Deactivate the projectile if it exceeds its range
        if (this.distanceTraveled >= this.range) {
            this.active = false;
        }
    }

    draw(ctx) {
        ctx.fillStyle = 'yellow';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    checkCollision(player) {
        return (
            this.x < player.x + player.width &&
            this.x + this.width > player.x &&
            this.y < player.y + player.height &&
            this.y + this.height > player.y
        );
    }
}

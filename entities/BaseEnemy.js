export default class BaseEnemy {
    constructor(x, y, platform, type = 'patrol', width = 32, height = 32, tileSize = 32) {
        this.x = x;
        this.y = y;
        this.startX = x;
        this.startY = y;
        this.width = width;
        this.height = height;
        this.platform = platform;
        this.patrolDirection = 'right';
        this.speed = 1;
        this.type = type;
        this.chaseRange = 250;
        this.tileSize = tileSize;
    }

    respawn() {
        this.x = this.startX;
        this.y = this.startY;
    }

    draw(ctx, camera) {
        if (this.image) {
            ctx.drawImage(this.image, this.x - camera.x, this.y, this.width, this.height);
        } else {
            ctx.fillStyle = 'red';
            ctx.fillRect(this.x - camera.x, this.y, this.width, this.height);
        }
    }

    checkCollision(player) {
        const boundingBox = this.getBoundingBox();
        return player.x + player.width > boundingBox.left &&
            player.x < boundingBox.right &&
            player.y + player.height > boundingBox.top &&
            player.y < boundingBox.bottom;
    }

    getBoundingBox() {
        if (!this.boundingBox) {
            return { left: this.x, right: this.x + this.width, top: this.y, bottom: this.y + this.height };
        }
        const { left, right, top, bottom } = this.boundingBox;
        return {
            left: this.x + left,
            right: this.x + right,
            top: this.y + top,
            bottom: this.y + bottom
        };
    }

    getPlatformAt(x, y, platforms) {
        for (let i = 0; i < platforms.length; i++) {
            const plat = platforms[i];
            if (
                x >= plat.x &&
                x < plat.x + plat.width &&
                y >= plat.y &&
                y < plat.y + plat.height
            ) {
                return plat;
            }
        }
        return null;
    }

    patrol(platforms) {
        const nextX = (this.patrolDirection === "right") ? this.x + this.speed : this.x - this.speed;
        const sensorX = (this.patrolDirection === "right") ? nextX + this.width : nextX;
        const sensorY = this.y + this.height + 1;

        if (!this.getPlatformAt(sensorX, sensorY, platforms)) {
            this.patrolDirection = (this.patrolDirection === "right") ? "left" : "right";
            return;
        }

        const wallSensorX = (this.patrolDirection === "right") ? this.x + this.width + this.speed : this.x - this.speed;
        const wallSensorY = this.y + this.height / 2;

        if (this.getPlatformAt(wallSensorX, wallSensorY, platforms)) {
            this.patrolDirection = (this.patrolDirection === "right") ? "left" : "right";
            return;
        }

        this.x = nextX;
    }

    hunt(player) {
        const distanceToPlayer = Math.hypot(player.x - this.x, player.y - this.y);

        if (distanceToPlayer < this.chaseRange) {
            const angle = Math.atan2(player.y - this.y, player.x - this.x);
            this.x += Math.cos(angle) * this.speed;
            this.y += Math.sin(angle) * this.speed;
        } else {
            const tolerance = 1;
            const distanceToStart = Math.hypot(this.startX - this.x, this.startY - this.y);

            if (distanceToStart > tolerance) {
                const angle = Math.atan2(this.startY - this.y, this.startX - this.x);
                this.x += Math.cos(angle) * this.speed;
                this.y += Math.sin(angle) * this.speed;
            } else {
                this.x = this.startX;
                this.y = this.startY;
            }
        }
    }
}
import MagicSpellEmitter from '../emitters/MagicSpellEmitter.js';

export default class Portal {
    constructor(x, y, targetX, targetY, color1, color2, density, count, emissionSpeed = 1) {
        this.x = x;
        this.y = y;
        this.targetX = targetX;
        this.targetY = targetY;
        this.emitter = new MagicSpellEmitter(x, y, color1, color2, density, count, emissionSpeed);
        this.width = this.emitter.width;
        this.height = this.emitter.height;
    }

    update(player, platforms) {
        this.emitter.update();
    }

    draw(ctx, camera) {
        this.emitter.draw(ctx, camera);
    }

    checkCollision(player) {
        const distance = Math.hypot(player.x + player.width / 2 - this.x, player.y + player.height / 2 - this.y);
        // Adjust the collision detection radius as needed
        if (distance < 64) {
            player.x = this.targetX;
            player.y = this.targetY;
            return false;
        }
        return false;
    }
}
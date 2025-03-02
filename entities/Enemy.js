import BaseEnemy from './BaseEnemy.js';

export default class Enemy extends BaseEnemy {
    constructor(x, y, image, platform, type = 'patrol', width = 32, height = 32, tileSize = 32) {
        super(x, y, platform, type, width, height, tileSize);
        this.image = image;
    }
}
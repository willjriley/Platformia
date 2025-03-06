import AnimatedEnemy from './AnimatedEnemy.js';

export default class Beholder extends AnimatedEnemy {
    constructor(x, y, onFireProjectile) {
        super(x, y, 'patrol', onFireProjectile, './assets/fantasy/beholder/animate.json');
    }

}
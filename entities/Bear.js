import AnimatedEnemy from './AnimatedEnemy.js';

export default class Bear extends AnimatedEnemy {
    constructor(x, y, onFireProjectile) {
        super(x, y, onFireProjectile, './assets/fantasy/Bear/animate.json');
    }

}
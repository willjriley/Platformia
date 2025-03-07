import AnimatedEnemy from './AnimatedEnemy.js';

export default class Salamander extends AnimatedEnemy {
    constructor(x, y, onFireProjectile) {
        super(x, y, 'patrol', onFireProjectile, './assets/fantasy/salamander/animate.json');
    }

}
import AnimatedEnemy from './AnimatedEntity.js';

export default class Salamander extends AnimatedEnemy {
    constructor(x, y, onFireProjectile) {
        super(x, y, onFireProjectile, './assets/fantasy/salamander/animate.json');
    }

}
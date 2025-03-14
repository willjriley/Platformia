import AnimatedEnemy from './AnimatedEntity.js';

export default class Ghost extends AnimatedEnemy {
    constructor(x, y, onFireProjectile) {
        super(x, y, onFireProjectile, './assets/fantasy/Ghost/animate.json');
    }

}
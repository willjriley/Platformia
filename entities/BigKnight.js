import AnimatedEnemy from './AnimatedEnemy.js';

export default class BigKnight extends AnimatedEnemy {
    constructor(x, y, onFireProjectile) {
        super(x, y, onFireProjectile, './assets/fantasy/BigKnight/animate.json');
    }

    setupFSM() {
        super.setupFSM();

        // Add custom transitions for BigKnight
        this.fsm.addTransition('attack', 'special_attack_right', 'special_attack', () => this.playAnimationSet('special_attack_right'));
        this.fsm.addTransition('attack', 'special_attack_left', 'special_attack', () => this.playAnimationSet('special_attack_left'));
    }

    handleState(player, platforms) {
        super.handleState(player, platforms);
        switch (this.fsm.getState()) {
            case 'special_attack':
                //this.performSpecialAttack();
                break;
            default:
                break;
        }
    }

    // if can perform a special attack
    canPerformSpecialAttack() {
        return true;
    }

    // special attack
    performSpecialAttack() {
        console.log('Performing special attack!');
    }
}
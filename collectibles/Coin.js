import CollectibleBase from './CollectibleBase.js';

class Coin extends CollectibleBase {
    constructor(x, y, width = 32, height = 32, frameRate = 5) {
        console.log('Coin constructor');
        const imageUrls = [
            './assets/castle/items/coin1.png',
            './assets/castle/items/coin2.png',
            './assets/castle/items/coin3.png',
            './assets/castle/items/coin4.png',
            './assets/castle/items/coin5.png',
            './assets/castle/items/coin6.png',
            './assets/castle/items/coin7.png',
            './assets/castle/items/coin8.png',
            './assets/castle/items/coin9.png',
            './assets/castle/items/coin10.png'
        ];
        super(x, y, imageUrls, 'coin', width, height, frameRate);
    }
}

export default Coin;
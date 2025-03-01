import CollectibleBase from './CollectibleBase.js';

class Heart extends CollectibleBase {
    constructor(x, y, width = 32, height = 32, frameRate = 5) {
        const imageUrls = [
            './assets/castle/items/heart1.png',
            './assets/castle/items/heart2.png',
            './assets/castle/items/heart3.png',
            './assets/castle/items/heart4.png',
            './assets/castle/items/heart5.png',
            './assets/castle/items/heart6.png',
            './assets/castle/items/heart7.png',
            './assets/castle/items/heart8.png',
            './assets/castle/items/heart9.png',
            './assets/castle/items/heart10.png'
        ];
        super(x, y, imageUrls, 'heart', width, height, frameRate);
    }
}

export default Heart;
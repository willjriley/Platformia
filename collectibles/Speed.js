import CollectibleBase from './CollectibleBase.js';

class Speed extends CollectibleBase {
    constructor(x, y, width = 32, height = 32, frameRate = 5) {
        const imageUrls = [
            './assets/castle/items/speed1.png',
            './assets/castle/items/speed2.png',
            './assets/castle/items/speed3.png',
            './assets/castle/items/speed4.png',
            './assets/castle/items/speed5.png',
            './assets/castle/items/speed6.png',
            './assets/castle/items/speed7.png',
            './assets/castle/items/speed8.png',
            './assets/castle/items/speed9.png',
            './assets/castle/items/speed10.png',
            './assets/castle/items/speed11.png',
            './assets/castle/items/speed12.png',
            './assets/castle/items/speed13.png',
            './assets/castle/items/speed14.png',
            './assets/castle/items/speed15.png',
            './assets/castle/items/speed16.png'
        ];
        super(x, y, imageUrls, 'speed', width, height, frameRate);
    }
}

export default Speed;
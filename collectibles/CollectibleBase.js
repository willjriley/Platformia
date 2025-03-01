class CollectibleBase {
    constructor(x, y, imageUrls, type, width = 32, height = 32, frameRate = 5) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.type = type;
        this.imageUrls = imageUrls;
        this.frameRate = frameRate;
        this.currentFrame = 0;
        this.frameCount = 0;
        this.images = [];
        this.imagesLoaded = 0;

        // Load images
        this.imageUrls.forEach(url => {
            const img = new Image();
            img.src = url;
            img.onload = () => {
                this.imagesLoaded++;
            };
            this.images.push(img);
        });
    }

    update() {
        if (this.images.length > 1 && this.imagesLoaded === this.images.length) {
            this.frameCount++;
            if (this.frameCount >= this.frameRate) {
                this.frameCount = 0;
                this.currentFrame = (this.currentFrame + 1) % this.images.length;
            }
        }
    }

    draw(ctx, camera) {
        if (this.images.length > 0 && this.imagesLoaded === this.images.length) {
            const image = this.images[this.currentFrame];
            ctx.drawImage(image, this.x - camera.x, this.y, this.width, this.height); // Offset by camera's x
        } else {
            ctx.fillStyle = 'yellow';
            ctx.fillRect(this.x - camera.x, this.y, this.width, this.height); // Offset by camera's x
        }
    }
}

export default CollectibleBase;
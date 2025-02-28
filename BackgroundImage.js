export default class BackgroundImage {
    constructor(x, y, width, height, imageSrc) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.image = new Image();
        this.image.src = imageSrc;
    }

    update() {
        // No updates needed
    }

    checkCollision(player) {
        return false;
    }


    draw(ctx, camera) {
        ctx.save();
        ctx.translate(this.x - camera.x, this.y - camera.y);
        ctx.drawImage(this.image, 0, 0, this.width, this.height);
        ctx.restore();
    }
}
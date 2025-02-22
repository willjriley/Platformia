function Boss(x, y, floorY, mapWidth, debug = false) {
    this.x = x;
    this.y = y;
    this.mapWidth = mapWidth; // Width of the map
    this.health = 100;
    this.direction = -1; // -1 for left, 1 for right
    this.speed = 2; // Speed of the boss
    this.state = 'walk'; // Possible states: 'idle', 'walk', 'hit'
    this.frameIndex = 0;
    this.tickCount = 0;
    this.ticksPerFrame = 10; // Adjust this value to control the animation speed
    this.debug = debug; // Debug flag to control drawing of debugging visuals
    this.hitAnimationPlaying = false; // Flag to indicate if the hit animation is playing
    this.hitAnimationCount = 0; // Counter to track the number of times the hit animation has played
    this.hitAnimationCompleted = false; // Flag to indicate if the hit animation has completed

    // Set the minimum and maximum travel distances
    this.minX = 200;
    this.maxX = 1800;

    // Load images for left and right directions
    this.walkRightImages = [];
    this.walkLeftImages = [];
    this.idleRightImages = [];
    this.idleLeftImages = [];
    this.hitRightImages = [];
    this.hitLeftImages = [];

    for (let i = 0; i < 18; i++) { // Assuming 18 frames for each state
        const walkRightImage = new Image();
        walkRightImage.src = `./assets/enemies/jimmy/Walk/Char1-Walk_${i}.png`;
        this.walkRightImages.push(walkRightImage);

        const walkLeftImage = new Image();
        walkLeftImage.src = `./assets/enemies/jimmy/Walk/Char1-Walk_${i}_left.png`;
        this.walkLeftImages.push(walkLeftImage);
    }

    for (let i = 0; i < 10; i++) { // Assuming 10 frames for each state
        const idleRightImage = new Image();
        idleRightImage.src = `./assets/enemies/jimmy/Idle/Char1-Idle_${i}.png`;
        this.idleRightImages.push(idleRightImage);

        const idleLeftImage = new Image();
        idleLeftImage.src = `./assets/enemies/jimmy/Idle/Char1-Idle_${i}_left.png`;
        this.idleLeftImages.push(idleLeftImage);
    }

    for (let i = 15; i < 25; i++) { // Assuming 10 frames for each state
        const hitRightImage = new Image();
        hitRightImage.src = `./assets/enemies/jimmy/Hit/Char1-Hit_${i}.png`;
        this.hitRightImages.push(hitRightImage);

        const hitLeftImage = new Image();
        hitLeftImage.src = `./assets/enemies/jimmy/Hit/Char1-Hit_${i}_left.png`;
        this.hitLeftImages.push(hitLeftImage);
    }

    // Set the initial image
    this.image = this.walkLeftImages[0];
}

Boss.prototype.update = function (ctx, camera, player) {
    // Check if the player is inside the bounds of the boss
    const bossBoundingBox = this.getBoundingBox();
    // console.log(`Player - x: ${player.x}, y: ${player.y}`);
    // console.log(`Boss - x: ${this.x}, y: ${this.y}`);
    // console.log(`BoundingBox - left: ${bossBoundingBox.left}, right: ${bossBoundingBox.right}, top: ${bossBoundingBox.top}, bottom: ${bossBoundingBox.bottom}`);

    if (player.x > bossBoundingBox.left && player.x < bossBoundingBox.right) {
        if (this.state !== 'hit' && !this.hitAnimationPlaying) {
            this.state = 'hit';
            this.frameIndex = 0; // Reset the frame index when changing state
            this.hitAnimationPlaying = true; // Set the flag to indicate the hit animation is playing
            this.hitAnimationCount = 0; // Reset the hit animation counter
            this.y = 610; // Set the y position for the hit state
            console.log(`State changed to: ${this.state}`);
        }
    } else {
        if (this.state !== 'walk' && !this.hitAnimationPlaying && !this.hitAnimationCompleted) {
            this.state = 'walk';
            this.frameIndex = 0; // Reset the frame index when changing state
            this.y = 670; // Set the y position for the walk state
        }
    }

    // Only update position if the state is 'walk'
    if (this.state === 'walk') {
        this.x += this.speed * this.direction;

        // Change direction if hitting the min or max travel distance
        if (this.x > this.maxX) {
            this.direction = -1;
            console.log('Direction changed to left');
        } else if (this.x < this.minX) {
            this.direction = 1;
            console.log('Direction changed to right');
        }
    }

    // Update the animation frame
    this.tickCount++;
    if (this.tickCount > this.ticksPerFrame) {
        this.tickCount = 0;
        this.frameIndex++;
        if (this.state === 'walk') {
            if (this.direction === 1) {
                this.image = this.walkRightImages[this.frameIndex % this.walkRightImages.length];
            } else {
                this.image = this.walkLeftImages[this.frameIndex % this.walkLeftImages.length];
            }
        } else if (this.state === 'hit') {
            if (this.direction === 1) {
                this.image = this.hitRightImages[this.frameIndex % this.hitRightImages.length];
            } else {
                this.image = this.hitLeftImages[this.frameIndex % this.hitLeftImages.length];
            }

            // Check if the hit animation has completed
            if (this.frameIndex % this.hitRightImages.length === 0) {
                this.hitAnimationCount++;
                if (this.hitAnimationCount >= 2) {
                    this.hitAnimationPlaying = false; // Reset the flag to indicate the hit animation has completed
                    this.hitAnimationCompleted = true; // Set the flag to indicate the hit animation has completed
                    setTimeout(() => {
                        this.hitAnimationCompleted = false; // Reset the flag after 20 seconds
                        this.state = 'idle'; // Change the state to idle
                        this.frameIndex = 0; // Reset the frame index
                        this.y = 678; // Set the y position for the idle state
                        console.log(`State changed to: ${this.state}`);
                    }, 2000); // 20 seconds delay
                }
            }
        } else if (this.state === 'idle') {
            if (this.direction === 1) {
                this.image = this.idleRightImages[this.frameIndex % this.idleRightImages.length];
            } else {
                this.image = this.idleLeftImages[this.frameIndex % this.idleLeftImages.length];
            }
        }
    }
}

Boss.prototype.getBoundingBox = function () {
    const image = this.image;
    if (!image || image.width === 0 || image.height === 0) return { left: this.x, right: this.x, top: this.y, bottom: this.y }; // Return a default bounding box if the image is not loaded or has invalid dimensions

    const width = image.width;
    const height = image.height;

    // Create an off-screen canvas to analyze the image
    const offScreenCanvas = document.createElement('canvas');
    offScreenCanvas.width = width;
    offScreenCanvas.height = height;
    const offScreenCtx = offScreenCanvas.getContext('2d');
    offScreenCtx.drawImage(image, 0, 0);

    // Get the image data
    const imageData = offScreenCtx.getImageData(0, 0, width, height);
    const data = imageData.data;

    // Initialize bounding box coordinates
    let left = width;
    let right = 0;
    let top = height;
    let bottom = 0;

    // Iterate over the image data to find the non-transparent bounds
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const alpha = data[(y * width + x) * 4 + 3];
            if (alpha > 0) { // Non-transparent pixel
                if (x < left) left = x;
                if (x > right) right = x;
                if (y < top) top = y;
                if (y > bottom) bottom = y;
            }
        }
    }

    // Adjust the bounding box coordinates to be relative to the boss's position
    left = this.x - width / 2 + left;
    right = this.x - width / 2 + right;
    top = this.y - height / 2 + top;
    bottom = this.y - height / 2 + bottom;

    const boundingBox = {
        left: left,
        right: right,
        top: top,
        bottom: bottom
    };

    // Log bounding box coordinates
    // console.log(`BoundingBox - left: ${boundingBox.left}, right: ${boundingBox.right}, top: ${boundingBox.top}, bottom: ${boundingBox.bottom}`);

    return boundingBox;
}

Boss.prototype.getWidth = function () {
    const image = this.image;
    if (!image) return 0; // Return 0 if the image is not loaded
    return image.width;
}

Boss.prototype.getHeight = function () {
    const image = this.image;
    if (!image) return 0; // Return 0 if the image is not loaded
    return image.height;
}

Boss.prototype.draw = function (ctx, camera, player) {
    // Check if the boss is within the viewable area
    if (this.x + this.getWidth() / 2 < camera.x || this.x - this.getWidth() / 2 > camera.x + ctx.canvas.width ||
        this.y + this.getHeight() / 2 < camera.y || this.y - this.getHeight() / 2 > camera.y + ctx.canvas.height) {
        return; // Do not draw if the boss is outside the viewable area
    }

    ctx.save();
    ctx.translate(this.x - camera.x, this.y - camera.y);

    // Draw the current frame of the current state
    const image = this.image;
    if (image && image.complete && image.width > 0 && image.height > 0) { // Ensure the image is fully loaded and has valid dimensions before drawing
        ctx.drawImage(
            image,
            -this.getWidth() / 2, -this.getHeight() / 2,
            this.getWidth(), this.getHeight()
        );

        if (this.debug) {
            // Log image coordinates
            console.log(`Image - x: ${this.x}, y: ${this.y}, width: ${this.getWidth()}, height: ${this.getHeight()}`);

            // Draw border around the image
            ctx.strokeStyle = "#00FF00"; // Green
            ctx.lineWidth = 2;
            ctx.strokeRect(
                -this.getWidth() / 2, -this.getHeight() / 2,
                this.getWidth(), this.getHeight()
            );
        }
    } else {
        console.error(`Image not loaded or has invalid dimensions for state: ${this.state}`);
    }

    // Draw bounding box
    const boundingBox = this.getBoundingBox();
    if (this.debug) {
        ctx.strokeStyle = "#FF0000"; // Red
        ctx.lineWidth = 2;
        ctx.strokeRect(
            boundingBox.left - this.x,
            boundingBox.top - this.y,
            boundingBox.right - boundingBox.left,
            boundingBox.bottom - boundingBox.top
        );

        // Draw center of bounding box
        const centerX = (boundingBox.left + boundingBox.right) / 2;
        const centerY = (boundingBox.top + boundingBox.bottom) / 2;
        console.log(`Center of BoundingBox - x: ${centerX}, y: ${centerY}`);
        ctx.fillStyle = "#0000FF"; // Blue
        ctx.beginPath();
        ctx.arc(
            centerX - this.x,
            centerY - this.y,
            5, 0, 2 * Math.PI
        );
        ctx.fill();
    }

    // Draw player position
    if (player) {
        ctx.fillStyle = "#FFFF00"; // Yellow
        ctx.beginPath();
        ctx.arc(
            player.x - this.x,
            player.y - this.y,
            5, 0, 2 * Math.PI
        );
        ctx.fill();
    }

    ctx.restore();
}
export default class Player {
    constructor(x, y, mapData, height, gravity) {
        this.x = x || 50;
        this.y = y || 544;
        this.startX = x;
        this.startY = y;
        this.width = 32;
        this.height = 32;
        this.initialSpeed = 2;
        this.speed = 2;
        this.velocityX = 0;
        this.velocityY = 0;
        this.jumpPower = -8;
        this.color = 'blue';
        this.isJumping = false;
        this.image = new Image();
        this.image.src = "./assets/player1.png";
        this.facing = "right"; // default facing direction
        this.tileSize = 32;
        this.mapData = mapData;
        this.height = height;
        this.gravity = gravity;
        this.shieldsOn = false; // New property to track shield status
        this.particles = []; // Array to store particles
    }

    respawn() {
        this.x = this.startX;
        this.y = this.startY;
        this.velocityX = 0;
        this.velocityY = 0;
        this.isJumping = false;
        this.shieldsOn = false; // Reset shields on respawn
        this.particles = []; // Clear particles on respawn
    }

    draw(ctx, camera) {
        ctx.save();

        let drawX = this.x - camera.x;
        let drawY = this.y;

        // dynamic flip of image
        if (this.facing === "left") {
            ctx.translate(drawX + this.width, drawY);
            ctx.scale(-1, 1);
            ctx.drawImage(this.image, 0, 0, this.tileSize, this.tileSize, 0, 0, this.width, this.height);
        } else {
            ctx.translate(drawX, drawY);
            ctx.drawImage(this.image, 0, 0, this.tileSize, this.tileSize, 0, 0, this.width, this.height);
        }

        ctx.restore();

        // Draw particles if shields are on
        if (this.shieldsOn) {
            this.drawParticles(ctx, camera);
        }
    }

    move(mapData) {
        // Apply gravity with a maximum fall speed
        if (this.isJumping) {
            this.velocityY = Math.min(this.velocityY + this.gravity, 15);
        }

        // Predict next position
        let nextX = this.x + this.velocityX;
        let nextY = this.y + this.velocityY;

        // Apply movement with bounds checking
        // 600 is canvas height need to pass in at some point
        this.x = Math.max(0, Math.min(nextX, mapData[0].length * this.tileSize - this.width));
        this.y = Math.max(0, Math.min(nextY, 600 - this.height));

        // Reset jumping if we hit the ground
        if (this.y === this.height - this.height) {
            this.isJumping = false;
            this.velocityY = 0;
        }

        // Update particles if shields are on
        if (this.shieldsOn) {
            this.updateParticles();
        }
    }

    bounce(force, direction) {
        if (direction === 'vertical') {
            this.velocityY = -force;
        } else if (direction === 'horizontal') {
            this.velocityX = -force;
        }
    }

    activateShields() {
        this.shieldsOn = true;
        this.createParticles();
    }

    createParticles() {
        // Create particles around the player
        for (let i = 0; i < 100; i++) {
            this.particles.push({
                angle: Math.random() * 2 * Math.PI,
                radius: Math.random() * 20 + 10,
                speed: Math.random() * 0.05 + 0.01,
                color: 'rgba(241, 255, 132, 0.7)',
                distance: 0
            });
        }
    }

    updateParticles() {
        // Update particle positions
        this.particles.forEach(particle => {
            particle.distance += particle.speed;
            if (particle.distance > particle.radius) {
                particle.distance = 0;
                particle.angle = Math.random() * 2 * Math.PI;
            }
        });
    }

    drawParticles(ctx, camera) {
        // Draw beams around the player
        this.particles.forEach(particle => {
            const startX = this.x + this.width / 2 + Math.cos(particle.angle) * this.width / 2 - camera.x;
            const startY = this.y + this.height / 2 + Math.sin(particle.angle) * this.height / 2;
            const endX = startX + Math.cos(particle.angle) * particle.distance;
            const endY = startY + Math.sin(particle.angle) * particle.distance;

            ctx.strokeStyle = particle.color;
            ctx.lineWidth = particle.size;
            ctx.beginPath();
            ctx.moveTo(startX, startY);
            ctx.lineTo(endX, endY);
            ctx.stroke();
        });
    }
}
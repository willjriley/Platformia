function ParticleEmitter(x, y, color1, color2, density, count, image, alignment = 'top') {
    this.x = x;
    this.y = y;
    this.color1 = color1;
    this.color2 = color2;
    this.density = density;
    this.count = count;
    this.image = image ? new Image() : null;
    this.imageLoaded = false;
    this.alignment = alignment;
    if (this.image) {
        this.image.src = image;
        this.image.onload = () => {
            this.imageLoaded = true;
        };
    }
    this.particles = [];

    for (let i = 0; i < this.count; i++) {
        this.particles.push(this.createParticle());
    }
}

ParticleEmitter.prototype.createParticle = function () {
    return {
        x: this.x,
        y: this.y,
        velocityX: (Math.random() - 0.5) * this.density,
        velocityY: -Math.random() * this.density,
        life: Math.random() * 100
    };
}

ParticleEmitter.prototype.update = function () {
    this.particles.forEach(particle => {
        particle.x += particle.velocityX;
        particle.y += particle.velocityY;
        particle.life -= 1;

        if (particle.life <= 0) {
            Object.assign(particle, this.createParticle());
        }
    });
}

ParticleEmitter.prototype.draw = function (ctx, camera) {
    ctx.save();
    ctx.translate(this.x - camera.x, this.y - camera.y);

    // Draw the image if provided and loaded
    if (this.image && this.imageLoaded) {
        ctx.drawImage(this.image, -this.image.width / 2, -this.image.height / 2);
    }

    // Determine the vertical offset based on alignment
    let verticalOffset = 0;
    if (this.image) {
        if (this.alignment === 'top') {
            verticalOffset = -this.image.height / 2;
        } else if (this.alignment === 'middle') {
            verticalOffset = 0;
        } else if (this.alignment === 'bottom') {
            verticalOffset = this.image.height / 2;
        }
    } else {

        if (this.alignment === 'top') {
            verticalOffset = -32 / 2;
        } else if (this.alignment === 'middle') {
            verticalOffset = 0;
        } else if (this.alignment === 'bottom') {
            verticalOffset = 32 / 2;
        }

    }

    // Draw the particles
    this.particles.forEach(particle => {
        const gradient = ctx.createRadialGradient(particle.x - this.x, particle.y - this.y, 0, particle.x - this.x, particle.y - this.y, 2);
        gradient.addColorStop(0, this.color1);
        gradient.addColorStop(1, this.color2);

        ctx.fillStyle = gradient;
        ctx.globalAlpha = particle.life / 100;
        ctx.beginPath();
        ctx.arc(particle.x - this.x, particle.y - this.y + verticalOffset, 2, 0, Math.PI * 2);
        ctx.fill();
    });

    ctx.restore();
}
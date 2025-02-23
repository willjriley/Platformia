export default class SnowfallEmitter {
    constructor(x, y, color1, color2, density, count, emissionSpeed = 0.5) {
        this.x = x;
        this.y = y;
        this.color1 = color1;
        this.color2 = color2;
        this.density = density;
        this.count = count;
        this.emissionSpeed = emissionSpeed;
        this.particles = [];

        for (let i = 0; i < this.count; i++) {
            this.particles.push(this.createParticle());
        }
    }

    createParticle() {
        return {
            x: this.x + (Math.random() - 0.5) * 200, // Spread particles horizontally
            y: this.y,
            velocityX: (Math.random() - 0.5) * this.density,
            velocityY: Math.random() * this.density,
            life: Math.random() * 200 + 100
        };
    }

    update() {
        this.particles.forEach(particle => {
            particle.x += particle.velocityX * this.emissionSpeed;
            particle.y += particle.velocityY * this.emissionSpeed;
            particle.life -= 1;

            if (particle.life <= 0 || particle.y > this.y + 200) { // Reset particle if it falls too far
                Object.assign(particle, this.createParticle());
            }
        });
    }

    draw(ctx, camera) {
        ctx.save();
        ctx.translate(this.x - camera.x, this.y - camera.y);

        this.particles.forEach(particle => {
            const gradient = ctx.createRadialGradient(particle.x - this.x, particle.y - this.y, 0, particle.x - this.x, particle.y - this.y, 2);
            gradient.addColorStop(0, this.color1); // Start color
            gradient.addColorStop(1, this.color2); // End color
            ctx.fillStyle = gradient;
            ctx.globalAlpha = particle.life / 100;
            ctx.beginPath();
            ctx.arc(particle.x - this.x, particle.y - this.y, 2, 0, Math.PI * 2);
            ctx.fill();
        });

        ctx.restore();
    }
}
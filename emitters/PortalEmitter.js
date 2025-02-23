export default class PortalEmitter {
    constructor(x, y, color1, color2, density, count, emissionSpeed = 1) {
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
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.random() * 50 + 50; // Particles start from a ring around the portal
        return {
            x: this.x + radius * Math.cos(angle),
            y: this.y + radius * Math.sin(angle),
            velocityX: -Math.cos(angle) * this.density,
            velocityY: -Math.sin(angle) * this.density,
            life: Math.random() * 100 + 50
        };
    }

    update() {
        this.particles.forEach(particle => {
            particle.x += particle.velocityX * this.emissionSpeed;
            particle.y += particle.velocityY * this.emissionSpeed;
            particle.life -= 1;

            if (particle.life <= 0) {
                Object.assign(particle, this.createParticle());
            }
        });
    }

    draw(ctx, camera) {
        ctx.save();
        ctx.translate(this.x - camera.x, this.y - camera.y);

        // Draw the solid door
        //ctx.fillStyle = "#4B0082";
        //ctx.fillRect(-32, -64, 64, 128);

        // Draw the particles
        this.particles.forEach(particle => {
            const gradient = ctx.createRadialGradient(particle.x - this.x, particle.y - this.y, 0, particle.x - this.x, particle.y - this.y, 4);
            gradient.addColorStop(0, this.color1); // Start color
            gradient.addColorStop(1, this.color2); // End color
            ctx.fillStyle = gradient;
            ctx.globalAlpha = particle.life / 100;
            ctx.beginPath();
            ctx.arc(particle.x - this.x, particle.y - this.y, 4, 0, Math.PI * 2);
            ctx.fill();
        });

        ctx.restore();
    }
}
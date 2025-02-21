function MagicSpellEmitter(x, y, color1, color2, density, count, emissionSpeed = 1) {
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

MagicSpellEmitter.prototype.createParticle = function () {
    return {
        x: this.x,
        y: this.y,
        angle: Math.random() * Math.PI * 2,
        radius: Math.random() * 20,
        velocityRadius: Math.random() * this.density,
        life: Math.random() * 100 + 50
    };
}

MagicSpellEmitter.prototype.update = function () {
    this.particles.forEach(particle => {
        particle.radius += particle.velocityRadius * this.emissionSpeed;
        particle.angle += 0.05; // Swirl effect
        particle.x = this.x + particle.radius * Math.cos(particle.angle);
        particle.y = this.y + particle.radius * Math.sin(particle.angle);
        particle.life -= 1;

        if (particle.life <= 0) {
            Object.assign(particle, this.createParticle());
        }
    });
}

MagicSpellEmitter.prototype.draw = function (ctx, camera) {
    ctx.save();
    ctx.translate(this.x - camera.x, this.y - camera.y);

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
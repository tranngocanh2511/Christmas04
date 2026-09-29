/**
 * Celestial Sky Canvas: Snowfall, Twinkling Stars, and Sacred Stardust
 */

class CelestialCanvas {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);

    this.snowflakes = [];
    this.stars = [];
    this.stardust = [];
    this.maxSnow = 75;
    this.maxStars = 65;

    this.isRunning = true;
    this.init();
  }

  init() {
    this.resize();
    window.addEventListener('resize', () => this.resize());

    // Generate static starry sky
    for (let i = 0; i < this.maxStars; i++) {
      this.stars.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height * 0.85,
        radius: Math.random() * 1.6 + 0.4,
        alpha: Math.random() * 0.7 + 0.3,
        twinkleSpeed: Math.random() * 0.03 + 0.008,
        twinkleOffset: Math.random() * Math.PI * 2,
        isGolden: Math.random() > 0.75
      });
    }

    // Generate falling snowflakes
    for (let i = 0; i < this.maxSnow; i++) {
      this.snowflakes.push(this.createSnowflake(true));
    }

    // Start loop
    this.animate();
  }

  resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width * this.dpr;
    this.canvas.height = this.height * this.dpr;
    this.ctx.scale(this.dpr, this.dpr);
  }

  createSnowflake(randomY = false) {
    return {
      x: Math.random() * this.width,
      y: randomY ? Math.random() * this.height : -10,
      radius: Math.random() * 2.2 + 0.6,
      speedY: Math.random() * 0.9 + 0.4,
      speedX: (Math.random() - 0.5) * 0.3,
      sway: Math.random() * 0.02 + 0.01,
      swayOffset: Math.random() * Math.PI * 2,
      opacity: Math.random() * 0.65 + 0.25
    };
  }

  addStardustBurst(originX, originY, count = 25) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 3.5 + 1.0;
      this.stardust.push({
        x: originX,
        y: originY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1.5, // gentle upward drift
        radius: Math.random() * 2.5 + 1.0,
        alpha: 1,
        decay: Math.random() * 0.02 + 0.012,
        color: Math.random() > 0.3 ? '#f6ce74' : '#fff9d6'
      });
    }
  }

  animate() {
    if (!this.isRunning) return;

    this.ctx.clearRect(0, 0, this.width, this.height);

    const now = Date.now() * 0.001;

    // 1. Render Stars (Warm Golden Twinkles)
    for (let s of this.stars) {
      const currentAlpha = s.alpha * (0.6 + 0.4 * Math.sin(now * 3 * s.twinkleSpeed + s.twinkleOffset));
      this.ctx.beginPath();
      this.ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = s.isGolden
        ? `rgba(245, 158, 11, ${currentAlpha * 0.9})`
        : `rgba(217, 119, 6, ${currentAlpha * 0.8})`;
      this.ctx.fill();

      // Soft amber glow
      if (s.radius > 1.2) {
        this.ctx.beginPath();
        this.ctx.arc(s.x, s.y, s.radius * 2.2, 0, Math.PI * 2);
        this.ctx.fillStyle = `rgba(251, 191, 36, ${currentAlpha * 0.35})`;
        this.ctx.fill();
      }
    }

    // 2. Render Snowflakes (Crisp White with Soft Depth)
    for (let i = 0; i < this.snowflakes.length; i++) {
      let flake = this.snowflakes[i];
      flake.y += flake.speedY;
      flake.x += flake.speedX + Math.sin(now + flake.swayOffset) * 0.4;

      if (flake.y > this.height + 10 || flake.x < -15 || flake.x > this.width + 15) {
        this.snowflakes[i] = this.createSnowflake(false);
      }

      this.ctx.beginPath();
      this.ctx.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(flake.opacity + 0.3, 0.95)})`;
      this.ctx.shadowBlur = 4;
      this.ctx.shadowColor = 'rgba(56, 189, 248, 0.35)';
      this.ctx.fill();
      this.ctx.shadowBlur = 0;
    }

    // 3. Render Interactive Golden Stardust
    for (let i = this.stardust.length - 1; i >= 0; i--) {
      let p = this.stardust[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.02; // slight gravity
      p.alpha -= p.decay;

      if (p.alpha <= 0) {
        this.stardust.splice(i, 1);
        continue;
      }

      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = p.color;
      this.ctx.globalAlpha = p.alpha;
      this.ctx.shadowBlur = 8;
      this.ctx.shadowColor = '#f6ce74';
      this.ctx.fill();
      this.ctx.shadowBlur = 0;
      this.ctx.globalAlpha = 1;
    }

    requestAnimationFrame(() => this.animate());
  }
}

window.addEventListener('DOMContentLoaded', () => {
  window.celestialSky = new CelestialCanvas('sky-canvas');
});

document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("fireworks");
  const ctx = canvas.getContext("2d");
  const message = document.getElementById("message");
  const music = document.getElementById("music");

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener("resize", resize);

  const colors = ["#ff4d6d", "#ffd166", "#06d6a0", "#4cc9f0", "#f72585", "#ffffff"];

  class Particle {
    constructor(x, y, angle, speed, color) {
      this.x = x;
      this.y = y;
      this.angle = angle;
      this.speed = speed;
      this.life = 120;
      this.size = Math.random() * 3 + 1;
      this.color = color;
    }

    update() {
      this.x += Math.cos(this.angle) * this.speed;
      this.y += Math.sin(this.angle) * this.speed;
      this.speed *= 0.96;
      this.life--;
    }

    draw() {
      ctx.globalAlpha = this.life / 120;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
      ctx.globalAlpha = 1;
    }
  }

  let particles = [];

  function explosion(x, y) {
    for (let i = 0; i < 140; i++) {
      particles.push(
        new Particle(
          x,
          y,
          Math.random() * Math.PI * 2,
          Math.random() * 6 + 2,
          colors[Math.floor(Math.random() * colors.length)]
        )
      );
    }
  }

  function heart(x, y) {
    for (let t = 0; t < Math.PI * 2; t += 0.05) {
      const hx = 16 * Math.pow(Math.sin(t), 3);
      const hy =
        13 * Math.cos(t) -
        5 * Math.cos(2 * t) -
        2 * Math.cos(3 * t) -
        Math.cos(4 * t);

      particles.push(
        new Particle(x, y, Math.atan2(-hy, hx), 3, "#ff4d6d")
      );
    }
  }

  function animate() {
    // Arka planı BOZMADAN fade
    ctx.globalCompositeOperation = "destination-out";
    ctx.fillStyle = "rgba(0,0,0,0.12)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.globalCompositeOperation = "source-over";

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.update();
      p.draw();
      if (p.life <= 0) particles.splice(i, 1);
    }

    requestAnimationFrame(animate);
  }
  animate();

  // İlk otomatik patlama + kalp
  function startIntro() {
    explosion(canvas.width / 2, canvas.height / 2);

    setTimeout(() => {
      heart(canvas.width / 2, canvas.height / 2 - 50);
    }, 900);

    setTimeout(() => {
      message.classList.add("show");
      music?.play().catch(() => {});
    }, 1800);
  }

  setTimeout(startIntro, 700);

  // 🔥 HER TIKLAMADA HAVAİ FİŞEK
  function handleClick(e) {
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || e.touches?.[0].clientX) - rect.left;
    const y = (e.clientY || e.touches?.[0].clientY) - rect.top;

    explosion(x, y);

    // Müzik ilk tıklamada başlasın
    music?.play().catch(() => {});
  }

  window.addEventListener("click", handleClick);
  window.addEventListener("touchstart", handleClick);
});
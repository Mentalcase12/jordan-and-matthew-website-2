// --- Fireflies / Particles Effect Logic ---
(function() { // Wrap in IIFE
    const canvas = document.getElementById('comfort-particles-canvas');
    if (!canvas) { console.error("Comfort particles canvas not found"); return; }
    const ctx = canvas.getContext('2d');
    if (!ctx) { console.error("Could not get 2D context for comfort particles canvas"); return; }

    let W = canvas.width = window.innerWidth;
    let H = canvas.height = window.innerHeight;
    let animationFrameId = null;

    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * W;
            this.y = Math.random() * H;
            this.radius = Math.random() * 1.5 + 0.5; // Small, glowing particles
            this.color = `rgba(255, 200, 255, ${Math.random() * 0.7 + 0.3})`; // Soft, glowing pink/purple
            this.speed = Math.random() * 0.05 + 0.02; // Slower movement
            this.angle = Math.random() * Math.PI * 2;
            this.life = Math.random() * 100 + 50; // How long it "lives"
            this.alpha = 0; // Starts transparent
            this.fadeSpeed = Math.random() * 0.01 + 0.005; // Speed of fading in/out
            this.fadingIn = true;
        }

        update() {
            // Gentle floating motion
            this.x += Math.cos(this.angle) * this.speed;
            this.y += Math.sin(this.angle) * this.speed;

            // Random slight change in direction
            this.angle += (Math.random() - 0.5) * 0.05;

            // Boundary checks: wrap around
            if (this.x < 0) this.x = W;
            if (this.x > W) this.x = 0;
            if (this.y < 0) this.y = H;
            if (this.y > H) this.y = 0;

            // Fade in/out logic
            if (this.fadingIn) {
                this.alpha += this.fadeSpeed;
                if (this.alpha >= 1) {
                    this.alpha = 1;
                    this.fadingIn = false;
                    this.life = Math.random() * 100 + 50; // Reset life once fully visible
                }
            } else {
                this.life--;
                if (this.life <= 0) {
                    this.alpha -= this.fadeSpeed * 2; // Fade out faster
                    if (this.alpha <= 0) {
                        this.reset(); // Recreate particle
                        this.fadingIn = true;
                    }
                }
            }
        }

        draw() {
            ctx.save();
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = this.color.replace(')', `, ${this.alpha})`); // Adjust alpha dynamically
            ctx.shadowBlur = 10;
            ctx.shadowColor = `rgba(255, 200, 255, ${this.alpha})`; // Glowing effect
            ctx.fill();
            ctx.restore();
        }
    }

    // Create more particles for a denser effect
    const particles = new Array(120).fill().map(() => new Particle()); 

    function anim() {
        ctx.clearRect(0, 0, W, H); // Clear canvas each frame
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        animationFrameId = requestAnimationFrame(anim);
    }

    // Handle window resize
    window.addEventListener('resize', () => {
        if (animationFrameId) { cancelAnimationFrame(animationFrameId); }
        W = canvas.width = window.innerWidth;
        H = canvas.height = window.innerHeight;
        // Re-initialize particles to spread them out on new dimensions
        particles.forEach(p => p.reset()); 
        anim();
    });

    anim(); // Start animation
})();
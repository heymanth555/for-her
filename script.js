/* ========================
   1. SMOOTH COUNTER LOGIC
   ======================== */
const startDate = new Date("2025-07-05T00:00:00"); 

// Helper: Calculate time difference
function getTimeDiff() {
    const now = new Date();
    const diff = now - startDate;
    return {
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        mins: Math.floor((diff / 1000 / 60) % 60)
    };
}

// A. Initial Animation (0 -> Current Time)
const finalValues = getTimeDiff();
const counter = { d: 0, h: 0, m: 0 }; // Start at 0

gsap.to(counter, {
    duration: 3.5,       // Animation takes 3.5 seconds
    d: finalValues.days,
    h: finalValues.hours,
    m: finalValues.mins,
    ease: "power2.out",  // Slows down at the end
    onUpdate: () => {
        // Update HTML while animating
        document.getElementById('days').innerText = Math.floor(counter.d);
        document.getElementById('hours').innerText = Math.floor(counter.h);
        document.getElementById('mins').innerText = Math.floor(counter.m);
    },
    onComplete: () => {
        // B. Switch to Live Clock after animation
        setInterval(updateRealTime, 1000);
    }
});

// Real-time updater (runs every second after animation)
function updateRealTime() {
    const current = getTimeDiff();
    document.getElementById('days').innerText = current.days;
    document.getElementById('hours').innerText = current.hours;
    document.getElementById('mins').innerText = current.mins;
}

/* ========================
   2. SCROLL ANIMATIONS
   ======================== */
gsap.registerPlugin(ScrollTrigger);

// Hero Fade In
gsap.from(".hero-content > *", {
    y: 50, opacity: 0, duration: 1.5, stagger: 0.2, ease: "power3.out"
});

// Section Animations
const sections = document.querySelectorAll('.memory-section');
sections.forEach(section => {
    gsap.from(section.querySelector('.image-container'), {
        y: 100, opacity: 0, duration: 1,
        scrollTrigger: { trigger: section, start: "top 75%" }
    });
    gsap.from(section.querySelector('.text-content'), {
        y: 50, opacity: 0, duration: 1, delay: 0.2,
        scrollTrigger: { trigger: section, start: "top 75%" }
    });
});

/* ========================
   3. HEART ANIMATION
   ======================== */
const canvas = document.getElementById('heart-canvas');
const ctx = canvas.getContext('2d');
let width, height;
let hearts = [];

function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

class Heart {
    constructor(x, y, type = 'bg') {
        this.x = x || Math.random() * width;
        this.y = y || height + 20;
        this.size = Math.random() * 10 + 5;
        this.speedY = Math.random() * 1 + 0.3;
        this.opacity = Math.random() * 0.4 + 0.1;
        this.type = type; 
        if(type === 'burst') {
            this.speedY = Math.random() * 5 + 2;
            this.speedX = (Math.random() - 0.5) * 5;
            this.opacity = 1;
            this.size = Math.random() * 15 + 10;
        }
    }
    update() {
        this.y -= this.speedY;
        if(this.type === 'burst') {
            this.x += this.speedX;
            this.opacity -= 0.01;
        }
        if (this.y < -50 || this.opacity <= 0) this.reset();
    }
    draw() {
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = '#c77dff';
        ctx.font = `${this.size}px serif`;
        ctx.fillText('❤', this.x, this.y);
        ctx.globalAlpha = 1;
    }
}
function initHearts() { for(let i=0; i<30; i++) hearts.push(new Heart()); }
function animateHearts() {
    ctx.clearRect(0, 0, width, height);
    hearts.forEach(h => { h.update(); h.draw(); });
    requestAnimationFrame(animateHearts);
}
document.getElementById('burst-btn').addEventListener('click', () => {
    for(let i=0; i<50; i++) hearts.push(new Heart(width/2, height/2, 'burst'));
});
initHearts();
animateHearts();

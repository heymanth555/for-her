/* =========================================
   1. SMOOTH ANIMATED COUNTER (Time Together)
   ========================================= */
const startDate = new Date("2025-07-05T00:00:00"); 

// Helper: Calculate exact time difference
function getTimeDiff() {
    const now = new Date();
    const diff = now - startDate;
    return {
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        mins: Math.floor((diff / 1000 / 60) % 60)
    };
}

// A. Initial Animation (0 -> Current Value)
const finalValues = getTimeDiff();
const counter = { d: 0, h: 0, m: 0 }; // Proxy object to animate

gsap.to(counter, {
    duration: 3,         // Animation lasts 3 seconds
    d: finalValues.days,
    h: finalValues.hours,
    m: finalValues.mins,
    ease: "power2.out",  // Smooth deceleration
    onUpdate: () => {
        // Update DOM with integer values
        document.getElementById('days').innerText = Math.floor(counter.d);
        document.getElementById('hours').innerText = Math.floor(counter.h);
        document.getElementById('mins').innerText = Math.floor(counter.m);
    },
    onComplete: () => {
        // B. Switch to Real-Time Clock after animation
        setInterval(updateRealTime, 1000);
    }
});

// Real-time updater (runs every second after animation finishes)
function updateRealTime() {
    const current = getTimeDiff();
    document.getElementById('days').innerText = current.days;
    document.getElementById('hours').innerText = current.hours;
    document.getElementById('mins').innerText = current.mins;
}


/* =========================================
   2. LIVE HEARTS BACKGROUND
   ========================================= */
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
    reset() {
        if(this.type === 'burst') {
            hearts = hearts.filter(h => h !== this);
            return;
        }
        this.y = height + 20;
        this.x = Math.random() * width;
        this.opacity = Math.random() * 0.4 + 0.1;
    }
    draw() {
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = '#c77dff'; // Purple hearts
        ctx.font = `${this.size}px serif`;
        ctx.fillText('❤', this.x, this.y);
        ctx.globalAlpha = 1;
    }
}

function initHearts() {
    for(let i=0; i<35; i++) hearts.push(new Heart());
}

function animateHearts() {
    ctx.clearRect(0, 0, width, height);
    hearts.forEach(h => {
        h.update();
        h.draw();
    });
    requestAnimationFrame(animateHearts);
}

document.getElementById('burst-btn').addEventListener('click', () => {
    for(let i=0; i<60; i++) {
        hearts.push(new Heart(width/2, height/2, 'burst'));
    }
});

initHearts();
animateHearts();


/* =========================================
   3. GSAP SCROLL ANIMATIONS
   ========================================= */
gsap.registerPlugin(ScrollTrigger);

// Hero Fade In
gsap.from(".gsap-hero", {
    y: 50,
    opacity: 0,
    duration: 1.5,
    stagger: 0.2,
    ease: "power3.out"
});

// Image Parallax Effect
const images = document.querySelectorAll('.parallax-img');
images.forEach(img => {
    gsap.to(img, {
        yPercent: 20, 
        ease: "none",
        scrollTrigger: {
            trigger: img.parentElement,
            start: "top bottom",
            end: "bottom top",
            scrub: true
        }
    });
});

// Card Reveal on Scroll
const cards = document.querySelectorAll('.card');
cards.forEach(card => {
    gsap.from(card, {
        y: 100,
        opacity: 0,
        duration: 1,
        scrollTrigger: {
            trigger: card,
            start: "top 90%",
            toggleActions: "play none none reverse"
        }
    });
});

// Footer Reveal
gsap.from(".gsap-footer", {
    scale: 0.8,
    opacity: 0,
    duration: 1,
    stagger: 0.2,
    scrollTrigger: {
        trigger: ".footer",
        start: "top 80%"
    }
});

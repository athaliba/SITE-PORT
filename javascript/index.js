const canvas = document.querySelector('canvas.particles');
const ctx = canvas.getContext('2d');

let width, height;
const PARTICLE_COUNT = 120;
const particles = [];
const maxDistance = 100;
let mouse = { x: null, y: null, radius: 150 };

function resize() {
    width = window.innerWidth;
    height = window.innerHeight - document.querySelector('header').offsetHeight - document.querySelector('footer').offsetHeight;
    canvas.width = width;
    canvas.height = height;
}
resize();
window.addEventListener('resize', resize);

// Cria partículas com posições aleatórias estáticas
for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * height,
        size: Math.random() * 2 + 1,
        baseX: 0,
        baseY: 0,
        speed: 0.05,
        dx: 0,
        dy: 0
    });
}

// Inicializa baseX e baseY fixos para cada partícula
particles.forEach(p => {
    p.baseX = p.x;
    p.baseY = p.y;
});

function drawParticle(p) {
    ctx.beginPath();
    const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 3);
    gradient.addColorStop(0, 'rgba(173, 216, 230, 0.9)'); // luz azul-clara
    gradient.addColorStop(1, 'rgba(173, 216, 230, 0)');
    ctx.fillStyle = gradient;
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
}

function connectParticles() {
    for (let a = 0; a < particles.length; a++) {
        for (let b = a + 1; b < particles.length; b++) {
            let dx = particles[a].x - particles[b].x;
            let dy = particles[a].y - particles[b].y;
            let dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < maxDistance) {
                ctx.strokeStyle = `rgba(173,216,230,${1 - dist / maxDistance})`; 
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(particles[a].x, particles[a].y);
                ctx.lineTo(particles[b].x, particles[b].y);
                ctx.stroke();
            }
        }
    }
}

function animate() {
    ctx.clearRect(0, 0, width, height);

    particles.forEach(p => {
        // Movimento suave em direção ao mouse quando perto
        if (mouse.x && mouse.y) {
            let dx = mouse.x - p.x;
            let dy = mouse.y - p.y;
            let dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < mouse.radius) {
                // Move partículas suavemente para próximo ao mouse com amortecimento
                let moveX = dx * 0.05;
                let moveY = dy * 0.05;

                p.x += moveX;
                p.y += moveY;
            } else {
                // Voltar suavemente para posição base fixa
                let baseDx = p.baseX - p.x;
                let baseDy = p.baseY - p.y;

                p.x += baseDx * 0.02;
                p.y += baseDy * 0.02;
            }
        } else {
            // Se o mouse não estiver sobre a tela, volta para base
            let baseDx = p.baseX - p.x;
            let baseDy = p.baseY - p.y;

            p.x += baseDx * 0.02;
            p.y += baseDy * 0.02;
        }

        drawParticle(p);
    });

    connectParticles();

    requestAnimationFrame(animate);
}

animate();

// Atualiza posição do mouse relativa ao canvas
window.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
});

window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
});

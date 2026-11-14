/* ==========================================================================
   EXECUTIVE MINING PORTFOLIO - INTERACTIVE PHYSICS, NAVIGATION & TELEMETRY
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    initMobileDroplist();
    initElasticCable();
    initMatrixAccordion();
    initLenticularSweep();
    initContactInteractions();
    initScrollHUD();
});

/**
 * 0. Mobile Droplist Toggle Controller
 */
function initMobileDroplist() {
    const menuBtn = document.getElementById('mobileMenuBtn');
    const droplist = document.getElementById('mobileDroplist');

    if (!menuBtn || !droplist) return;

    const toggleMenu = (forceClose = false) => {
        const isOpen = forceClose ? false : !droplist.classList.contains('open');
        droplist.classList.toggle('open', isOpen);
        menuBtn.classList.toggle('open', isOpen);
        menuBtn.setAttribute('aria-expanded', String(isOpen));
        droplist.setAttribute('aria-hidden', String(!isOpen));
    };

    menuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleMenu();
    });

    // Close droplist when any navigation link inside it is clicked
    droplist.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => toggleMenu(true));
    });

    // Close droplist when clicking outside navbar
    document.addEventListener('click', (e) => {
        if (!droplist.contains(e.target) && !menuBtn.contains(e.target)) {
            toggleMenu(true);
        }
    });
}

/**
 * 1. Elastic Hoist Cable Simulator
 */
function initElasticCable() {
    const svg = document.getElementById('stringSvg');
    const path = document.getElementById('stringPath');
    const guide = document.getElementById('guideLine');
    const anchorL = document.getElementById('anchorL');
    const anchorR = document.getElementById('anchorR');
    const grip = document.getElementById('grip');
    const readout = document.getElementById('tensionReadout');

    if (!svg || !path) return;

    let width = svg.clientWidth;
    let height = svg.clientHeight;
    let midY = height / 2;

    let targetX = width / 2;
    let targetY = midY;
    let currentX = width / 2;
    let currentY = midY;
    let velX = 0;
    let velY = 0;
    let isInteracting = false;

    const stiffness = 0.14;
    const damping = 0.82;

    function updateDimensions() {
        width = svg.clientWidth;
        height = svg.clientHeight;
        midY = height / 2;

        guide.setAttribute('x1', 16);
        guide.setAttribute('y1', midY);
        guide.setAttribute('x2', width - 16);
        guide.setAttribute('y2', midY);

        anchorL.setAttribute('cx', 16);
        anchorL.setAttribute('cy', midY);
        anchorR.setAttribute('cx', width - 16);
        anchorR.setAttribute('cy', midY);

        if (!isInteracting) {
            targetX = width / 2;
            targetY = midY;
        }
    }

    window.addEventListener('resize', updateDimensions);
    updateDimensions();

    function handleMove(clientX, clientY) {
        const rect = svg.getBoundingClientRect();
        const x = Math.max(30, Math.min(width - 30, clientX - rect.left));
        const y = Math.max(10, Math.min(height - 10, clientY - rect.top));
        isInteracting = true;
        targetX = x;
        targetY = y;
    }

    svg.addEventListener('mousemove', (e) => handleMove(e.clientX, e.clientY));
    svg.addEventListener('touchmove', (e) => {
        if (e.touches.length > 0) {
            handleMove(e.touches[0].clientX, e.touches[0].clientY);
        }
    }, { passive: true });

    const resetCable = () => {
        isInteracting = false;
        targetX = width / 2;
        targetY = midY;
    };

    svg.addEventListener('mouseleave', resetCable);
    svg.addEventListener('touchend', resetCable);

    function animate() {
        const forceX = (targetX - currentX) * stiffness;
        const forceY = (targetY - currentY) * stiffness;

        velX = (velX + forceX) * damping;
        velY = (velY + forceY) * damping;

        currentX += velX;
        currentY += velY;

        const d = `M 16 ${midY} Q ${currentX} ${currentY} ${width - 16} ${midY}`;
        path.setAttribute('d', d);
        grip.setAttribute('cx', currentX);
        grip.setAttribute('cy', currentY);

        const deflection = Math.abs(currentY - midY);
        const loadKN = (deflection * 12.4).toFixed(1).padStart(5, '0');
        readout.textContent = `LOAD: ${loadKN} kN`;

        requestAnimationFrame(animate);
    }

    animate();
}

/**
 * 2. Matrix Concession Accordion
 */
function initMatrixAccordion() {
    const slices = document.querySelectorAll('.slice');
    slices.forEach((slice) => {
        const activate = () => {
            slices.forEach((s) => {
                s.classList.remove('active');
                s.setAttribute('aria-expanded', 'false');
            });
            slice.classList.add('active');
            slice.setAttribute('aria-expanded', 'true');
        };

        slice.addEventListener('click', activate);
        slice.addEventListener('mouseenter', activate);
        slice.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                activate();
            }
        });
    });
}

/**
 * 3. Lenticular Before/After Reclamation Sweep
 */
function initLenticularSweep() {
    const stage = document.getElementById('lentiStage');
    const beforeLayer = document.getElementById('lentiBefore');
    const divider = document.getElementById('lentiDivider');

    if (!stage || !beforeLayer || !divider) return;

    const updateSweep = (clientX) => {
        const rect = stage.getBoundingClientRect();
        let pct = ((clientX - rect.left) / rect.width) * 100;
        pct = Math.max(0, Math.min(100, pct));

        beforeLayer.style.clipPath = `inset(0 ${100 - pct}% 0 0)`;
        divider.style.left = `${pct}%`;
    };

    stage.addEventListener('mousemove', (e) => updateSweep(e.clientX));
    stage.addEventListener('touchmove', (e) => {
        if (e.touches.length > 0) {
            updateSweep(e.touches[0].clientX);
        }
    }, { passive: true });
}

/**
 * 4. Contact Copy & Corporate Dispatch Form
 */
function initContactInteractions() {
    const copyBtn = document.getElementById('copyEmailBtn');
    const copyText = document.getElementById('copyEmailText');
    const form = document.getElementById('dispatchForm');
    const feedback = document.getElementById('formFeedback');

    if (copyBtn && copyText) {
        copyBtn.addEventListener('click', () => {
            const email = 'kyo@nusantaramineral.co.id';
            navigator.clipboard.writeText(email).then(() => {
                copyText.textContent = 'EMAIL DISALIN ✓';
                setTimeout(() => {
                    copyText.textContent = email;
                }, 2200);
            });
        });
    }

    if (form && feedback) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('senderName').value.trim();
            const sector = document.getElementById('sectorSelect').value;

            feedback.textContent = `✓ Dispatch dari ${name} (${sector}) telah diteruskan ke meja eksekutif Mas Kyo.`;
            form.reset();
        });
    }
}

/**
 * 5. Scroll Progress HUD Bar
 */
function initScrollHUD() {
    const hudFill = document.getElementById('hudFill');
    const hudPct = document.getElementById('hudPct');

    if (!hudFill || !hudPct) return;

    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const pct = docHeight > 0 ? Math.min(100, Math.round((scrollTop / docHeight) * 100)) : 0;

        hudFill.style.width = `${pct}%`;
        hudPct.textContent = `${String(pct).padStart(3, '0')}%`;
    }, { passive: true });
}

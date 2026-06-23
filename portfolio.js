const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', isOpen);
});

navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
    });
});

document.getElementById('year').textContent = new Date().getFullYear();

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isTouch = window.matchMedia('(hover: none), (pointer: coarse)').matches;

function rafThrottle(fn) {
    let scheduled = false;
    return (...args) => {
        if (scheduled) return;
        scheduled = true;
        requestAnimationFrame(() => {
            fn(...args);
            scheduled = false;
        });
    };
}

function assignStaggerIndices(containerSelector, itemSelector) {
    document.querySelectorAll(containerSelector).forEach((container) => {
        container.querySelectorAll(itemSelector).forEach((item, index) => {
            item.style.setProperty('--reveal-index', index);
        });
    });
}

function initRevealAnimations() {
    assignStaggerIndices('.project-grid', '.project-card');
    assignStaggerIndices('.tag-list', 'li');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
}

function initNavbarScrollState() {
    const navbar = document.querySelector('.navbar');
    const updateScrollState = rafThrottle(() => {
        navbar.classList.toggle('scrolled', window.scrollY > 40);
    });
    window.addEventListener('scroll', updateScrollState, { passive: true });
}

function initActiveLinkHighlight() {
    const sections = document.querySelectorAll('main section[id]');
    const linkByHash = new Map();
    navLinks.querySelectorAll('a').forEach((link) => {
        linkByHash.set(link.getAttribute('href'), link);
    });

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const activeLink = linkByHash.get(`#${entry.target.id}`);
            if (!activeLink) return;
            linkByHash.forEach((link) => link.classList.remove('active'));
            activeLink.classList.add('active');
        });
    }, { threshold: 0, rootMargin: '-45% 0px -45% 0px' });

    sections.forEach((section) => sectionObserver.observe(section));
}

function initCardTilt() {
    if (isTouch || prefersReducedMotion) return;

    const tiltMaxDeg = 8;

    document.querySelectorAll('.project-card').forEach((card) => {
        let rect = null;

        const handleMove = rafThrottle((event) => {
            if (!rect) return;
            const x = (event.clientX - rect.left) / rect.width;
            const y = (event.clientY - rect.top) / rect.height;
            const rotateY = (x - 0.5) * 2 * tiltMaxDeg;
            const rotateX = (0.5 - y) * 2 * tiltMaxDeg;
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
        });

        card.addEventListener('mouseenter', () => {
            rect = card.getBoundingClientRect();
        });

        card.addEventListener('mousemove', handleMove);

        card.addEventListener('mouseleave', () => {
            rect = null;
            card.style.transform = '';
        });
    });
}

function initMagneticButtons() {
    if (isTouch || prefersReducedMotion) return;

    document.querySelectorAll('.btn').forEach((btn) => {
        let rect = null;

        const handleMove = rafThrottle((event) => {
            if (!rect) return;
            const x = event.clientX - (rect.left + rect.width / 2);
            const y = event.clientY - (rect.top + rect.height / 2);
            btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
        });

        btn.addEventListener('mouseenter', () => {
            rect = btn.getBoundingClientRect();
        });

        btn.addEventListener('mousemove', handleMove);

        btn.addEventListener('mouseleave', () => {
            rect = null;
            btn.style.transform = '';
        });
    });
}

function initCursorGlow() {
    if (isTouch || prefersReducedMotion) return;

    const glow = document.querySelector('.cursor-glow');
    if (!glow) return;

    const handleMove = rafThrottle((event) => {
        glow.style.transform = `translate(${event.clientX}px, ${event.clientY}px) translate(-50%, -50%)`;
        glow.classList.add('is-active');
    });

    document.addEventListener('mousemove', handleMove, { passive: true });
    document.addEventListener('mouseleave', () => glow.classList.remove('is-active'));
}

initRevealAnimations();
initNavbarScrollState();
initActiveLinkHighlight();
initCardTilt();
initMagneticButtons();
initCursorGlow();

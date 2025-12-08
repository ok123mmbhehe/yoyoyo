// ======= SECURITY & FEATURES =======

// ======= DISABLE F12 & DEVELOPER TOOLS =======
document.addEventListener('keydown', (e) => {
    if (e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && ['I', 'J', 'K', 'C'].includes(e.key))) {
        e.preventDefault();
        return false;
    }
});

// ======= DISABLE RIGHT CLICK CONTEXT MENU =======
document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    return false;
});

// ======= DETECT DEVTOOLS OPEN =======
let devtools = { open: false };
const threshold = 160;

setInterval(() => {
    if (window.outerHeight - window.innerHeight > threshold ||
        window.outerWidth - window.innerWidth > threshold) {
        if (!devtools.open) {
            devtools.open = true;
            console.warn('Developer Tools detected');
        }
    } else {
        devtools.open = false;
    }
}, 500);

console.log('Deramirum Security & Features Loaded ✓');

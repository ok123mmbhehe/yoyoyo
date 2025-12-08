const animationStyle = document.createElement('style');
animationStyle.textContent = `
    @keyframes slideIn {
        from { transform: translateX(400px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(400px); opacity: 0; }
    }
    @keyframes ripple { to { transform: scale(4); opacity: 0; } }
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }
`;
document.head.appendChild(animationStyle);

const currencyFormatter = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
});

const cartBtn = document.querySelector('.cart-btn');
const cartOverlay = document.createElement('div');
cartOverlay.className = 'cart-overlay';
const cartPanel = document.createElement('div');
cartPanel.className = 'cart-panel';
cartPanel.innerHTML = `
    <div class="cart-panel-header">
        <h3>Giỏ hàng</h3>
        <button class="cart-close" aria-label="Đóng giỏ hàng">&times;</button>
    </div>
    <div class="cart-items"></div>
    <div class="cart-summary">
        <div class="cart-total">
            <span>Tổng cộng</span>
            <span class="cart-total-value">0 ₫</span>
        </div>
        <button class="cart-checkout" disabled>Tiếp tục thanh toán</button>
    </div>
`;
document.body.appendChild(cartOverlay);
document.body.appendChild(cartPanel);

const cartItemsContainer = cartPanel.querySelector('.cart-items');
const cartTotalValue = cartPanel.querySelector('.cart-total-value');
const cartCheckoutBtn = cartPanel.querySelector('.cart-checkout');
const cartCloseBtn = cartPanel.querySelector('.cart-close');
const productsGrid = document.querySelector('.products-grid');
let categoryTransitionTimer;
const scrollTopBtn = document.createElement('button');
scrollTopBtn.className = 'scroll-btn scroll-btn-up hidden';
scrollTopBtn.setAttribute('aria-label', 'Lên đầu trang');
scrollTopBtn.textContent = '↑';

const scrollBottomBtn = document.createElement('button');
scrollBottomBtn.className = 'scroll-btn scroll-btn-down hidden';
scrollBottomBtn.setAttribute('aria-label', 'Xuống cuối trang');
scrollBottomBtn.textContent = '↓';

document.body.appendChild(scrollTopBtn);
document.body.appendChild(scrollBottomBtn);
const scrollFadeElements = Array.from(document.querySelectorAll('.product-card, .principle-card, .blog-card, .info-box, .category-btn, .page-card'));
scrollFadeElements.forEach(el => el.classList.add('scroll-fade'));
const languageToggles = document.querySelectorAll('.language-toggle');
let currentLanguage = localStorage.getItem('deramirum_lang') || 'vi';
document.body.setAttribute('data-language', currentLanguage);
const quickSearchForms = document.querySelectorAll('.quick-search');
const productSearchInput = document.querySelector('.product-search');

let cartItems = [];
let cartCount = 0;

function openCartPanel() {
    cartOverlay.classList.add('active');
    cartPanel.classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeCartPanel() {
    cartOverlay.classList.remove('active');
    cartPanel.classList.remove('open');
    document.body.style.overflow = '';
}

if (cartBtn) {
    cartBtn.addEventListener('click', () => {
        if (cartItems.length === 0) {
            showNotification('Giỏ hàng đang trống. Hãy thêm sản phẩm trước nhé!');
        }
        openCartPanel();
    });
}

cartOverlay.addEventListener('click', closeCartPanel);
cartCloseBtn.addEventListener('click', closeCartPanel);
document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        closeCartPanel();
    }
});

cartCheckoutBtn.addEventListener('click', () => {
    showNotification('Tính năng thanh toán đang được phát triển.');
});

scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

scrollBottomBtn.addEventListener('click', () => {
    window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
});

function updateScrollButtons() {
    const scrollY = window.scrollY || window.pageYOffset;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight - 10;
    if (scrollY > 120) {
        scrollTopBtn.classList.remove('hidden');
    } else {
        scrollTopBtn.classList.add('hidden');
    }
    if (scrollY < maxScroll) {
        scrollBottomBtn.classList.remove('hidden');
    } else {
        scrollBottomBtn.classList.add('hidden');
    }
}

window.addEventListener('scroll', updateScrollButtons);
window.addEventListener('resize', updateScrollButtons);
window.addEventListener('scroll', handleScrollFade);
window.addEventListener('resize', handleScrollFade);

function handleScrollFade() {
    const viewportCenter = window.innerHeight / 2;
    scrollFadeElements.forEach(el => {
        const rect = el.getBoundingClientRect();
        const elementCenter = rect.top + rect.height / 2;
        const distance = Math.abs(elementCenter - viewportCenter);
        const normalized = Math.min(distance / viewportCenter, 1);
        const opacity = 1 - normalized * 0.3;
        const scale = 1 - normalized * 0.02;
        const blur = normalized * 1.2;
        el.style.opacity = opacity.toFixed(2);
        el.style.transform = `scale(${scale})`;
        el.style.filter = `blur(${blur}px)`;
    });
}

languageToggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
        setLanguage(currentLanguage === 'vi' ? 'en' : 'vi');
    });
    toggle.querySelectorAll('.language-option').forEach(option => {
        option.addEventListener('click', (event) => {
            event.stopPropagation();
            const targetLang = option.dataset.lang;
            if (targetLang !== currentLanguage) {
                setLanguage(targetLang);
            }
        });
    });
});

setLanguage(currentLanguage, false);

function setLanguage(lang, animated = true) {
    currentLanguage = lang;
    localStorage.setItem('deramirum_lang', lang);
    document.documentElement.setAttribute('lang', lang);
    document.body.setAttribute('data-language', lang);
    if (animated) {
        document.body.classList.add('language-transition');
        setTimeout(() => document.body.classList.remove('language-transition'), 600);
    }
    languageToggles.forEach(toggle => {
        toggle.dataset.lang = lang;
    });
    showNotification(lang === 'vi' ? 'Đang xem tiếng Việt' : 'Viewing English version');
}

quickSearchForms.forEach(form => {
    form.addEventListener('submit', (e) => {
        const input = form.querySelector('.quick-search-input');
        const query = input.value.trim();
        if (!query) {
            e.preventDefault();
            input.focus();
            return;
        }
        form.action = 'products.html';
    });
});

if (productSearchInput) {
    const params = new URLSearchParams(window.location.search);
    const q = params.get('q');
    if (q) {
        productSearchInput.value = q;
        productSearchInput.focus();
        showNotification(`Đang tìm: ${q}`);
    }
}

function parsePrice(text) {
    const clean = text ? text.replace(/[^\d]/g, '') : '0';
    return parseInt(clean, 10) || 0;
}

function formatPrice(value) {
    return currencyFormatter.format(value);
}

function addItemToCart(product) {
    const existing = cartItems.find(item => item.name === product.name);
    if (existing) {
        existing.quantity += 1;
    } else {
        cartItems.push({ ...product, quantity: 1 });
    }
    updateCartDisplay();
    saveCartToCookie();
}

function updateCartDisplay() {
    cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    if (cartBtn) {
        cartBtn.textContent = cartCount > 0 ? `🛒 (${cartCount})` : '🛒';
    }
    renderCartItems();
}

function renderCartItems() {
    if (!cartItems.length) {
        cartItemsContainer.innerHTML = '<div class="cart-empty">Chưa có sản phẩm nào trong giỏ.</div>';
        cartTotalValue.textContent = '0 ₫';
        cartCheckoutBtn.disabled = true;
        return;
    }

    const itemsMarkup = cartItems.map(item => {
        const subtotal = item.price * item.quantity;
        const safeName = item.name.replace(/"/g, '&quot;');
        return `
            <div class="cart-item" data-name="${safeName}">
                <div class="cart-item-header">
                    <p class="cart-item-name">${item.name}</p>
                    <span class="cart-item-price">${formatPrice(subtotal)}</span>
                </div>
                <div class="cart-item-actions">
                    <div class="cart-qty-controls">
                        <button class="cart-qty-btn" data-action="decrease" data-name="${safeName}">-</button>
                        <span class="cart-qty">${item.quantity}</span>
                        <button class="cart-qty-btn" data-action="increase" data-name="${safeName}">+</button>
                    </div>
                    <button class="cart-remove" data-name="${safeName}">Xóa</button>
                </div>
                <small class="cart-item-price">${formatPrice(item.price)} / sản phẩm</small>
            </div>
        `;
    }).join('');

    cartItemsContainer.innerHTML = itemsMarkup;
    cartCheckoutBtn.disabled = false;
    cartTotalValue.textContent = formatPrice(cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0));
    attachCartItemEvents();
}

function attachCartItemEvents() {
    cartPanel.querySelectorAll('.cart-qty-btn').forEach(button => {
        button.addEventListener('click', () => {
            const { name, action } = button.dataset;
            updateItemQuantity(name, action === 'increase' ? 1 : -1);
        });
    });
    cartPanel.querySelectorAll('.cart-remove').forEach(button => {
        button.addEventListener('click', () => {
            removeCartItem(button.dataset.name);
        });
    });
}

function updateItemQuantity(name, delta) {
    const item = cartItems.find(product => product.name === name);
    if (!item) return;
    item.quantity += delta;
    if (item.quantity <= 0) {
        cartItems = cartItems.filter(product => product.name !== name);
    }
    updateCartDisplay();
    saveCartToCookie();
}

function removeCartItem(name) {
    cartItems = cartItems.filter(item => item.name !== name);
    updateCartDisplay();
    saveCartToCookie();
}

function createRippleEffect(button, event) {
    const ripple = document.createElement('span');
    ripple.style.cssText = `
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.5);
        transform: scale(0);
        animation: ripple 0.6s ease-out;
        pointer-events: none;
    `;
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    button.style.position = 'relative';
    button.style.overflow = 'hidden';
    button.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
}

function extractProductInfo(card) {
    const name = card.querySelector('h3')?.textContent?.trim() || 'Sản phẩm';
    const salePrice = card.querySelector('.price .sale')?.textContent;
    const originalPrice = card.querySelector('.price .original')?.textContent;
    const price = salePrice || originalPrice || '0';
    return {
        name,
        price: parsePrice(price)
    };
}

function attachAddToCartHandlers() {
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', (event) => {
            const card = button.closest('.product-card');
            if (!card) return;
            const product = extractProductInfo(card);
            addItemToCart(product);
            showNotification(`${product.name} đã được thêm vào giỏ hàng!`);
            createRippleEffect(button, event);
        });
    });
}

attachAddToCartHandlers();
renderCartItems();

const searchInputs = document.querySelectorAll('.search-cart input, .product-search');
searchInputs.forEach(input => {
    input.addEventListener('keyup', function () {
        const searchTerm = this.value.toLowerCase();
        document.querySelectorAll('.product-card').forEach(card => {
            const productName = card.querySelector('h3')?.textContent?.toLowerCase() || '';
            const description = card.querySelector('.description')?.textContent?.toLowerCase() || '';
            card.style.display = (productName.includes(searchTerm) || description.includes(searchTerm)) ? '' : 'none';
        });
    });
});

document.querySelectorAll('.category-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.category-btn').forEach(other => {
            other.style.backgroundColor = 'white';
            other.style.color = 'var(--primary-color)';
        });
        btn.style.backgroundColor = 'var(--primary-color)';
        btn.style.color = 'white';
        triggerCategoryTransition();
        showNotification(`Danh mục: ${btn.textContent.trim()}`);
    });
});

function triggerCategoryTransition() {
    if (!productsGrid) return;
    productsGrid.classList.add('category-fade-out');
    clearTimeout(categoryTransitionTimer);
    categoryTransitionTimer = setTimeout(() => {
        productsGrid.classList.remove('category-fade-out');
        productsGrid.classList.add('category-fade-in');
        setTimeout(() => productsGrid.classList.remove('category-fade-in'), 400);
    }, 280);
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        z-index: 200;
        animation: slideIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        box-shadow: 0 4px 15px rgba(139, 92, 246, 0.4);
    `;
    document.body.appendChild(notification);
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
        setTimeout(() => notification.remove(), 400);
    }, 2500);
}

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (event) => {
        const href = anchor.getAttribute('href');
        if (!href || href === '#') return;
        const target = document.querySelector(href);
        if (!target) return;
        event.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
});

window.addEventListener('load', () => {
    document.querySelectorAll('.product-card').forEach((card, index) => {
        card.style.opacity = '0';
        card.style.animation = `fadeIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) ${index * 0.08}s forwards`;
    });
    document.querySelectorAll('.principle-card').forEach((card, index) => {
        card.style.opacity = '0';
        card.style.animation = `fadeIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) ${index * 0.1}s forwards`;
    });
    document.querySelectorAll('.blog-card').forEach((card, index) => {
        card.style.opacity = '0';
        card.style.animation = `fadeIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) ${index * 0.1}s forwards`;
    });
    loadCartFromCookie();
    updateScrollButtons();
    handleScrollFade();
});

if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.style.animation = 'fadeIn 0.5s ease-in-out';
                observer.unobserve(img);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.product-image img, .blog-image img').forEach(img => {
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.5s ease-in-out';
        imageObserver.observe(img);
    });
}

const revealElements = document.querySelectorAll('.product-card, .principle-card, .blog-card');
const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards';
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

revealElements.forEach(el => revealObserver.observe(el));

const header = document.querySelector('.header');
if (header) {
    const updateHeaderState = () => {
        if (window.scrollY > 10) {
            header.classList.add('header-scrolled');
        } else {
            header.classList.remove('header-scrolled');
        }
    };
    updateHeaderState();
    window.addEventListener('scroll', updateHeaderState);
    window.addEventListener('load', updateHeaderState);
    document.addEventListener('mousemove', (event) => {
        const y = event.clientY / window.innerHeight;
        header.style.boxShadow = `0 4px 15px rgba(139, 92, 246, ${0.2 + (y * 0.1)})`;
    });
}

document.querySelectorAll('.product-card').forEach(card => {
    card.addEventListener('mousemove', (event) => {
        const rect = card.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width;
        const y = (event.clientY - rect.top) / rect.height;
        const rotateX = (y - 0.5) * 5;
        const rotateY = (x - 0.5) * 5;
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
    });
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
    });
});

function saveCartToCookie() {
    const cartData = JSON.stringify({ items: cartItems });
    document.cookie = `Deramirum_cart=${encodeURIComponent(cartData)}; path=/; max-age=${60 * 60 * 24 * 30}`;
}

function loadCartFromCookie() {
    const cookies = document.cookie.split('; ').map(row => row.split('='));
    const stored = cookies.find(([name]) => name === 'Deramirum_cart');
    if (!stored) {
        updateCartDisplay();
        return;
    }
    try {
        const parsed = JSON.parse(decodeURIComponent(stored[1]));
        cartItems = (parsed.items || []).map(item => ({
            name: item.name,
            price: item.price,
            quantity: item.quantity || 1
        }));
    } catch (error) {
        cartItems = [];
    }
    updateCartDisplay();
}

console.log('Deramirum Store - Cart & Interactions ready.');



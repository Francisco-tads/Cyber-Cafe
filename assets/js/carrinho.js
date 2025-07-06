// Cart functionality
let cart = [];

// Get product info from URL parameters
function getProductFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const productName = urlParams.get('product');
    const productPrice = urlParams.get('price');
    const productImage = urlParams.get('image');
    
    if (productName && productPrice && productImage) {
        addToCart({
            name: productName,
            price: parseFloat(productPrice),
            image: productImage,
            id: Date.now()
        });
    }
}

// Add item to cart
function addToCart(product) {
    const existingItem = cart.find(item => item.name === product.name);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    updateCartDisplay();
    saveCart();
}

// Remove item from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartDisplay();
    saveCart();
}

// Update item quantity
function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            updateCartDisplay();
            saveCart();
        }
    }
}

// Clear entire cart
function clearCart() {
    if (confirm('Tem certeza que deseja limpar o carrinho?')) {
        cart = [];
        updateCartDisplay();
        saveCart();
    }
}

// Update cart display
function updateCartDisplay() {
    const cartItemsContainer = document.getElementById('cart-items');
    const totalPriceElement = document.getElementById('total-price');
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="empty-cart">
                <i class='bx bx-cart'></i>
                <h3>Seu carrinho está vazio</h3>
                <p>Adicione alguns produtos deliciosos!</p>
            </div>
        `;
        totalPriceElement.textContent = '0,00';
        return;
    }
    
    let html = '';
    let total = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        html += `
            <div class="cart-item">
                <div class="item-info">
                    <img src="${item.image}" alt="${item.name}">
                    <div class="item-details">
                        <h4>${item.name}</h4>
                        <p>R$ ${item.price.toFixed(2).replace('.', ',')}</p>
                    </div>
                </div>
                <div class="quantity-controls">
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                    <button class="remove-btn" onclick="removeFromCart(${item.id})">
                        <i class='bx bx-trash'></i>
                    </button>
                </div>
            </div>
        `;
    });
    
    cartItemsContainer.innerHTML = html;
    totalPriceElement.textContent = total.toFixed(2).replace('.', ',');
}

// Show checkout section
function showCheckout() {
    if (cart.length === 0) {
        alert('Seu carrinho está vazio!');
        return;
    }
    
    document.getElementById('checkout-section').style.display = 'block';
    document.querySelector('.cart-section').style.display = 'none';
    
    updateOrderSummary();
}

// Hide checkout section
function hideCheckout() {
    document.getElementById('checkout-section').style.display = 'none';
    document.querySelector('.cart-section').style.display = 'block';
}

// Update order summary
function updateOrderSummary() {
    const orderItemsContainer = document.getElementById('order-items');
    const orderTotalElement = document.getElementById('order-total');
    
    let html = '';
    let total = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        html += `
            <div class="order-item">
                <span>${item.name} x${item.quantity}</span>
                <span>R$ ${itemTotal.toFixed(2).replace('.', ',')}</span>
            </div>
        `;
    });
    
    orderItemsContainer.innerHTML = html;
    orderTotalElement.textContent = total.toFixed(2).replace('.', ',');
}

// Handle form submission
document.getElementById('checkout-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = new FormData(this);
    const customerName = formData.get('customer-name');
    const customerAddress = formData.get('customer-address');
    const customerPhone = formData.get('customer-phone');
    const paymentMethod = formData.get('payment-method');
    
    // Here you would typically send the order to a server
    // For now, we'll just show a confirmation
    
    console.log('Pedido realizado:', {
        customer: {
            name: customerName,
            address: customerAddress,
            phone: customerPhone
        },
        paymentMethod: paymentMethod,
        items: cart,
        total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    });
    
    // Show confirmation
    document.getElementById('checkout-section').style.display = 'none';
    document.getElementById('confirmation-section').style.display = 'block';
    
    // Clear cart after successful order
    cart = [];
    saveCart();
});

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('coffee-cart', JSON.stringify(cart));
}

// Load cart from localStorage
function loadCart() {
    const savedCart = localStorage.getItem('coffee-cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
}

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    loadCart();
    getProductFromURL();
    updateCartDisplay();
});
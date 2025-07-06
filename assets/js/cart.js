// Shopping Cart System
class ShoppingCart {
    constructor() {
        this.cart = JSON.parse(localStorage.getItem('cart')) || [];
        this.init();
    }

    init() {
        this.updateCartCount();
        this.bindEvents();
        this.renderCart();
    }

    bindEvents() {
        // Add to cart buttons
        document.querySelectorAll('.add-to-cart').forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                this.addToCart(button);
            });
        });

        // Cart icon click
        document.getElementById('cart-icon').addEventListener('click', () => {
            this.toggleCart();
        });

        // Close cart
        document.getElementById('close-cart').addEventListener('click', () => {
            this.closeCart();
        });

        // Clear cart
        document.getElementById('clear-cart').addEventListener('click', () => {
            this.clearCart();
        });

        // Checkout button
        document.getElementById('checkout-btn').addEventListener('click', () => {
            this.openCheckout();
        });

        // Close checkout
        document.getElementById('close-checkout').addEventListener('click', () => {
            this.closeCheckout();
        });

        // Cancel checkout
        document.getElementById('cancel-checkout').addEventListener('click', () => {
            this.closeCheckout();
        });

        // Checkout form submit
        document.getElementById('checkout-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.processOrder();
        });

        // Close success modal
        document.getElementById('close-success').addEventListener('click', () => {
            this.closeSuccess();
        });

        // Close modals when clicking outside
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('cart-modal')) {
                this.closeCart();
            }
            if (e.target.classList.contains('checkout-modal')) {
                this.closeCheckout();
            }
            if (e.target.classList.contains('success-modal')) {
                this.closeSuccess();
            }
        });
    }

    addToCart(button) {
        const name = button.getAttribute('data-name');
        const price = parseFloat(button.getAttribute('data-price'));
        const image = button.getAttribute('data-image');

        const existingItem = this.cart.find(item => item.name === name);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.cart.push({
                name,
                price,
                image,
                quantity: 1
            });
        }

        this.saveCart();
        this.updateCartCount();
        this.renderCart();
        this.showAddedToCartMessage(name);
    }

    removeFromCart(name) {
        this.cart = this.cart.filter(item => item.name !== name);
        this.saveCart();
        this.updateCartCount();
        this.renderCart();
    }

    updateQuantity(name, newQuantity) {
        const item = this.cart.find(item => item.name === name);
        if (item) {
            if (newQuantity <= 0) {
                this.removeFromCart(name);
            } else {
                item.quantity = newQuantity;
                this.saveCart();
                this.updateCartCount();
                this.renderCart();
            }
        }
    }

    clearCart() {
        if (confirm('Tem certeza que deseja limpar o carrinho?')) {
            this.cart = [];
            this.saveCart();
            this.updateCartCount();
            this.renderCart();
        }
    }

    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.cart));
    }

    updateCartCount() {
        const count = this.cart.reduce((total, item) => total + item.quantity, 0);
        document.getElementById('cart-count').textContent = count;
    }

    getCartTotal() {
        return this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    renderCart() {
        const cartItems = document.getElementById('cart-items');
        const cartTotal = document.getElementById('cart-total');

        if (this.cart.length === 0) {
            cartItems.innerHTML = '<p style="text-align: center; color: #666; padding: 2rem;">Seu carrinho está vazio</p>';
        } else {
            cartItems.innerHTML = this.cart.map(item => `
                <div class="cart-item">
                    <img src="${item.image}" alt="${item.name}">
                    <div class="cart-item-info">
                        <h4>${item.name}</h4>
                        <p>R$ ${item.price.toFixed(2).replace('.', ',')}</p>
                        <div class="quantity-controls">
                            <button class="quantity-btn" onclick="cart.updateQuantity('${item.name}', ${item.quantity - 1})">-</button>
                            <span class="quantity">${item.quantity}</span>
                            <button class="quantity-btn" onclick="cart.updateQuantity('${item.name}', ${item.quantity + 1})">+</button>
                            <button class="remove-item" onclick="cart.removeFromCart('${item.name}')">Remover</button>
                        </div>
                    </div>
                </div>
            `).join('');
        }

        cartTotal.textContent = this.getCartTotal().toFixed(2).replace('.', ',');
    }

    toggleCart() {
        const cartModal = document.getElementById('cart-modal');
        cartModal.classList.toggle('active');
    }

    closeCart() {
        document.getElementById('cart-modal').classList.remove('active');
    }

    openCheckout() {
        if (this.cart.length === 0) {
            alert('Seu carrinho está vazio!');
            return;
        }

        this.closeCart();
        this.renderOrderSummary();
        document.getElementById('checkout-modal').classList.add('active');
    }

    closeCheckout() {
        document.getElementById('checkout-modal').classList.remove('active');
    }

    renderOrderSummary() {
        const orderItems = document.getElementById('order-items');
        const orderTotal = document.getElementById('order-total');

        orderItems.innerHTML = this.cart.map(item => `
            <div class="order-item">
                <span>${item.name} x${item.quantity}</span>
                <span>R$ ${(item.price * item.quantity).toFixed(2).replace('.', ',')}</span>
            </div>
        `).join('');

        orderTotal.textContent = this.getCartTotal().toFixed(2).replace('.', ',');
    }

    processOrder() {
        const formData = new FormData(document.getElementById('checkout-form'));
        const orderData = {
            customer: {
                name: formData.get('customerName'),
                address: formData.get('customerAddress'),
                phone: formData.get('customerPhone')
            },
            paymentMethod: formData.get('paymentMethod'),
            items: this.cart,
            total: this.getCartTotal(),
            date: new Date().toLocaleString('pt-BR')
        };

        // Here you would typically send the order to a server
        console.log('Pedido processado:', orderData);

        // For demo purposes, we'll just show success and clear cart
        this.closeCheckout();
        this.showSuccess();
        this.cart = [];
        this.saveCart();
        this.updateCartCount();
        this.renderCart();

        // In a real application, you might want to send this data to WhatsApp or email
        this.sendOrderToWhatsApp(orderData);
    }

    sendOrderToWhatsApp(orderData) {
        const message = `🛒 *NOVO PEDIDO - CYBER CAFÉ*\n\n` +
            `👤 *Cliente:* ${orderData.customer.name}\n` +
            `📍 *Endereço:* ${orderData.customer.address}\n` +
            `📱 *Telefone:* ${orderData.customer.phone}\n` +
            `💳 *Pagamento:* ${orderData.paymentMethod === 'pix' ? 'PIX - 11991298838' : 'Dinheiro'}\n\n` +
            `📋 *Itens:*\n` +
            orderData.items.map(item => 
                `• ${item.name} x${item.quantity} - R$ ${(item.price * item.quantity).toFixed(2).replace('.', ',')}`
            ).join('\n') +
            `\n\n💰 *Total: R$ ${orderData.total.toFixed(2).replace('.', ',')}*\n` +
            `📅 *Data: ${orderData.date}*`;

        const whatsappUrl = `https://api.whatsapp.com/send?phone=5511991298838&text=${encodeURIComponent(message)}`;
        
        // Open WhatsApp in a new tab after a short delay
        setTimeout(() => {
            window.open(whatsappUrl, '_blank');
        }, 2000);
    }

    showSuccess() {
        document.getElementById('success-modal').classList.add('active');
    }

    closeSuccess() {
        document.getElementById('success-modal').classList.remove('active');
    }

    showAddedToCartMessage(productName) {
        // Create a temporary notification
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: var(--main-color);
            color: white;
            padding: 1rem 2rem;
            border-radius: 0.5rem;
            z-index: 10001;
            animation: slideIn 0.3s ease;
        `;
        notification.textContent = `${productName} adicionado ao carrinho!`;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}

// Initialize cart when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.cart = new ShoppingCart();
});

// Add CSS animation for notification
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);
console.log("hello")
let search = document.querySelector('.search-box');

document.querySelector('#search-icon').onclick = () =>{
    search.classList.toggle('active');
    navbar.classList.remove('active');
    
}

let navbar = document.querySelector('.navbar');

document.querySelector('#menu-icon').onclick = () =>{
    navbar.classList.toggle('active');
    search.classList.remove('active');
    
}

window.onscroll = () =>{
    navbar.classList.remove('active');
    search.classList.remove('active');
}

let header = document.querySelector('header');
window.addEventListener('scroll', () => {
    header.classList.toggle('shadow', window.scrollY > 0);
});

// Search functionality
const products = [
    { name: 'PURO AMERICANO', price: 26.99, image: 'assets/img/p1.png' },
    { name: 'PURO AMERICANO', price: 23.49, image: 'assets/img/p2.png' },
    { name: 'PURO AMERICANO', price: 23.49, image: 'assets/img/p3.png' },
    { name: 'PURO AMERICANO', price: 26.99, image: 'assets/img/p4.png' },
    { name: 'PURO AMERICANO', price: 26.99, image: 'assets/img/p5.png' },
    { name: 'PURO AMERICANO', price: 26.99, image: 'assets/img/p6.png' },
    { name: 'CAFÉ EXPRESSO', price: 18.99, image: 'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { name: 'CAPPUCCINO', price: 24.99, image: 'https://images.pexels.com/photos/312418/pexels-photo-312418.jpeg?auto=compress&cs=tinysrgb&w=400' }
];

let searchInput = document.querySelector('.search-box input');
let searchResults = null;

// Create search results container
function createSearchResults() {
    if (!searchResults) {
        searchResults = document.createElement('div');
        searchResults.className = 'search-results';
        searchResults.style.cssText = `
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: var(--bg-color);
            border-radius: 0 0 10px 10px;
            box-shadow: var(--box-shadow);
            max-height: 400px;
            overflow-y: auto;
            z-index: 1000;
            display: none;
        `;
        document.querySelector('.search-box').appendChild(searchResults);
    }
    return searchResults;
}

// Filter products based on search term
function filterProducts(searchTerm) {
    if (!searchTerm.trim()) {
        return [];
    }
    
    return products.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
}

// Display search results
function displaySearchResults(filteredProducts) {
    const resultsContainer = createSearchResults();
    
    if (filteredProducts.length === 0) {
        resultsContainer.innerHTML = `
            <div style="padding: 20px; text-align: center; color: #666;">
                <i class='bx bx-search-alt' style="font-size: 2rem; margin-bottom: 10px; display: block;"></i>
                Nenhum produto encontrado
            </div>
        `;
        resultsContainer.style.display = 'block';
        return;
    }
    
    let html = '';
    filteredProducts.forEach((product, index) => {
        html += `
            <div class="search-result-item" style="
                padding: 15px 20px;
                border-bottom: 1px solid var(--second-color);
                cursor: pointer;
                transition: background-color 0.3s ease;
                display: flex;
                align-items: center;
                gap: 15px;
            " onclick="selectProduct('${product.name}', ${product.price}, '${product.image}')">
                <img src="${product.image}" alt="${product.name}" style="
                    width: 50px;
                    height: 50px;
                    object-fit: contain;
                    background: #f1f1f1;
                    border-radius: 5px;
                    padding: 5px;
                ">
                <div style="flex: 1;">
                    <h4 style="margin: 0; color: var(--text-color); font-size: 0.9rem;">${product.name}</h4>
                    <p style="margin: 5px 0 0 0; color: var(--main-color); font-weight: 600;">R$ ${product.price.toFixed(2).replace('.', ',')}</p>
                </div>
                <i class='bx bx-cart-add' style="font-size: 1.5rem; color: var(--main-color);"></i>
            </div>
        `;
    });
    
    resultsContainer.innerHTML = html;
    resultsContainer.style.display = 'block';
    
    // Add hover effects
    const resultItems = resultsContainer.querySelectorAll('.search-result-item');
    resultItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.backgroundColor = 'var(--second-color)';
        });
        item.addEventListener('mouseleave', function() {
            this.style.backgroundColor = 'transparent';
        });
    });
}

// Hide search results
function hideSearchResults() {
    if (searchResults) {
        searchResults.style.display = 'none';
    }
}

// Select product from search results
function selectProduct(productName, price, image) {
    // Add to cart and open cart page
    const cartUrl = `carrinho.html?product=${encodeURIComponent(productName)}&price=${price}&image=${encodeURIComponent(image)}`;
    window.open(cartUrl, '_blank');
    
    // Clear search and hide results
    searchInput.value = '';
    hideSearchResults();
    search.classList.remove('active');
}

// Scroll to products section
function scrollToProducts() {
    const productsSection = document.getElementById('products');
    if (productsSection) {
        productsSection.scrollIntoView({ behavior: 'smooth' });
    }
}

// Search input event listeners
if (searchInput) {
    searchInput.addEventListener('input', function(e) {
        const searchTerm = e.target.value;
        const filteredProducts = filterProducts(searchTerm);
        
        if (searchTerm.trim()) {
            displaySearchResults(filteredProducts);
        } else {
            hideSearchResults();
        }
    });
    
    searchInput.addEventListener('focus', function(e) {
        const searchTerm = e.target.value;
        if (searchTerm.trim()) {
            const filteredProducts = filterProducts(searchTerm);
            displaySearchResults(filteredProducts);
        }
    });
    
    searchInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            const searchTerm = e.target.value.trim();
            if (searchTerm) {
                const filteredProducts = filterProducts(searchTerm);
                if (filteredProducts.length > 0) {
                    // Select first result
                    const firstProduct = filteredProducts[0];
                    selectProduct(firstProduct.name, firstProduct.price, firstProduct.image);
                } else {
                    // Scroll to products section if no results
                    scrollToProducts();
                    hideSearchResults();
                    search.classList.remove('active');
                }
            }
        }
        
        if (e.key === 'Escape') {
            hideSearchResults();
            searchInput.blur();
            search.classList.remove('active');
        }
    });
}

// Hide search results when clicking outside
document.addEventListener('click', function(e) {
    if (!search.contains(e.target)) {
        hideSearchResults();
    }
});

// Prevent search results from closing when clicking inside search box
if (search) {
    search.addEventListener('click', function(e) {
        e.stopPropagation();
    });
}
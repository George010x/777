// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ ZooHelper JS загружен!'); // Тест в F12
    
    // Корзина из localStorage
    let cart = JSON.parse(localStorage.getItem('zooCart')) || [];
    updateCartCount();
    
    // Клик "Купить"
    document.querySelectorAll('.btn-buy').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const id = this.dataset.productId;
            const name = this.dataset.name;
            const price = parseInt(this.dataset.price);
            
            // Добавь в корзину
            const item = cart.find(item => item.id == id);
            if (item) {
                item.qty += 1;
            } else {
                cart.push({ id, name, price, qty: 1 });
            }
            localStorage.setItem('zooCart', JSON.stringify(cart));
            showToast(`✅ ${name} добавлен!`);
            updateCartCount();
        });
    });
    
    // Иконка корзины
    document.getElementById('cart-icon').addEventListener('click', toggleCart);
    document.getElementById('close-cart').addEventListener('click', toggleCart);
    
    // Оформить заказ
    document.getElementById('checkout-btn').addEventListener('click', function() {
        if (cart.length === 0) return showToast('❌ Корзина пуста!');
        const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
        window.open(`https://yookassa.ru/?amount=${total}`, '_blank'); // Замени на реальную ЮKassa
        cart = []; localStorage.setItem('zooCart', '[]');
        updateCartCount();
        showToast(`💳 Заказ на ${total} ₽ отправлен!`);
    });
});

function updateCartCount() {
    const count = cart.reduce((sum, item) => sum + item.qty, 0);
    document.getElementById('cart-count').textContent = count;
    document.getElementById('modal-cart-count').textContent = count;
    renderCartItems();
    document.getElementById('cart-total').textContent = `Итого: ${cart.reduce((sum, item) => sum + item.price * item.qty, 0)} ₽`;
}

function renderCartItems() {
    const container = document.getElementById('cart-items');
    if (cart.length === 0) {
        container.innerHTML = '<p>Корзина пуста 😿 </p>';
        return;
    }
    container.innerHTML = cart.map(item => `
        <div class="cart-item">
            <span>${item.name} ×${item.qty}</span>
            <span>${item.price * item.qty} ₽</span>
        </div>
    `).join('');
}

function toggleCart() {
    const modal = document.getElementById('cart-modal');
    modal.classList.toggle('hidden');
}

function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.remove('hidden', 'show');
    setTimeout(() => toast.classList.add('show'), 100);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.classList.add('hidden'), 300);
    }, 3000);
}

// Глобальная переменная cart (для простоты)
let cart = JSON.parse(localStorage.getItem('zooCart')) || [];

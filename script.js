const form = document.getElementById('orderForm');
const ordersBody = document.getElementById('ordersBody');

// ФУНКЦИЯ ОТПРАВКИ ЗАКАЗА
form.addEventListener('submit', (e) => {
    e.preventDefault();

    const order = {
        id: Date.now(),
        name: document.getElementById('firstName').value + ' ' + document.getElementById('lastName').value,
        phone: document.getElementById('phone').value,
        duration: document.getElementById('duration').value,
        time: document.getElementById('time').value
    };

    // Сохраняем в LocalStorage
    let orders = JSON.parse(localStorage.getItem('scooter_orders') || '[]');
    orders.push(order);
    localStorage.setItem('scooter_orders', JSON.stringify(orders));

    // Показываем успех
    const successMsg = document.getElementById('successMsg');
    successMsg.style.display = 'block';
    form.reset();
    renderOrders();
    
    setTimeout(() => { successMsg.style.display = 'none'; }, 3000);
});

// ОТОБРАЖЕНИЕ ЗАКАЗОВ В ТАБЛИЦЕ
function renderOrders() {
    let orders = JSON.parse(localStorage.getItem('scooter_orders') || '[]');
    ordersBody.innerHTML = '';

    // Выводим новые заказы сверху (через reverse)
    orders.slice().reverse().forEach(order => {
        const row = `
            <tr>
                <td>${order.name}</td>
                <td><a href="tel:${order.phone}">${order.phone}</a></td>
                <td>${order.time}<br><b>(${order.duration})</b></td>
                <td><button class="delete-btn" onclick="deleteOrder(${order.id})">❌</button></td>
            </tr>
        `;
        ordersBody.innerHTML += row;
    });
}

// УДАЛЕНИЕ ОДНОГО ЗАКАЗА
window.deleteOrder = function(id) {
    let orders = JSON.parse(localStorage.getItem('scooter_orders') || '[]');
    orders = orders.filter(o => o.id !== id);
    localStorage.setItem('scooter_orders', JSON.stringify(orders));
    renderOrders();
}

// ОЧИСТКА ВСЕГО
window.clearAll = function() {
    if(confirm('Удалить все записи?')) {
        localStorage.removeItem('scooter_orders');
        renderOrders();
    }
}

// ПОКАЗ/СКРЫТИЕ АДМИНКИ
window.toggleAdmin = function() {
    const panel = document.getElementById('adminPanel');
    const isHidden = panel.style.display === 'none' || panel.style.display === '';
    panel.style.display = isHidden ? 'block' : 'none';
    if (isHidden) renderOrders();
}

// Загрузить данные при старте
renderOrders();

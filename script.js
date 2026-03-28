const form = document.getElementById('orderForm');
const ordersBody = document.getElementById('ordersBody');
const ADMIN_PASSWORD = "5535";

// ОТПРАВКА ЗАКАЗА
form.addEventListener('submit', (e) => {
    e.preventDefault();

    const order = {
        id: Date.now(),
        name: document.getElementById('firstName').value + ' ' + document.getElementById('lastName').value,
        phone: document.getElementById('phone').value,
        duration: document.getElementById('duration').value,
        time: document.getElementById('time').value,
        status: 'new'
    };

    let orders = JSON.parse(localStorage.getItem('scooter_orders') || '[]');
    orders.push(order);
    localStorage.setItem('scooter_orders', JSON.stringify(orders));

    const successMsg = document.getElementById('successMsg');
    successMsg.style.display = 'block';
    form.reset();
    
    // Обновляем таблицу если админка открыта
    if (document.getElementById('adminPanel').style.display === 'block') {
        renderOrders();
    }
    
    setTimeout(() => { successMsg.style.display = 'none'; }, 3000);
});

// ПАРОЛЬ НА АДМИНКУ
window.toggleAdmin = function() {
    const panel = document.getElementById('adminPanel');
    
    if (panel.style.display === 'none' || panel.style.display === '') {
        const pass = prompt("Введите пароль администратора:");
        if (pass === ADMIN_PASSWORD) {
            panel.style.display = 'block';
            renderOrders();
        } else if (pass !== null) {
            alert("Неверный пароль!");
        }
    } else {
        panel.style.display = 'none';
    }
}

// ОТОБРАЖЕНИЕ ЗАКАЗОВ
function renderOrders() {
    let orders = JSON.parse(localStorage.getItem('scooter_orders') || '[]');
    ordersBody.innerHTML = '';

    if (orders.length === 0) {
        ordersBody.innerHTML = '<tr><td colspan="4" style="text-align:center">Нет заказов</td></tr>';
        return;
    }

    orders.slice().reverse().forEach(order => {
        const isNew = order.status === 'new';
        
        const row = `
            <tr>
                <td><strong>${order.name}</strong></td>
                <td>
                    <a href="tel:${order.phone}">${order.phone}</a><br>
                    <small>${order.time.replace('T', ' ')} (${order.duration})</small>
                </td>
                <td>
                    <span class="status-badge ${isNew ? 'status-new' : 'status-confirmed'}">
                        ${isNew ? 'НОВЫЙ' : 'ОДОБРЕН'}
                    </span>
                </td>
                <td>
                    <div class="action-btns">
                        ${isNew ? `<button class="approve-btn" onclick="approveOrder(${order.id})" title="Одобрить">✅</button>` : ''}
                        <button class="delete-btn" onclick="deleteOrder(${order.id})" title="Удалить">❌</button>
                    </div>
                </td>
            </tr>
        `;
        ordersBody.innerHTML += row;
    });
}

// ОДОБРЕНИЕ ЗАКАЗА
window.approveOrder = function(id) {
    let orders = JSON.parse(localStorage.getItem('scooter_orders') || '[]');
    orders = orders.map(o => {
        if (o.id === id) o.status = 'confirmed';
        return o;
    });
    localStorage.setItem('scooter_orders', JSON.stringify(orders));
    renderOrders();
}

// УДАЛЕНИЕ ЗАКАЗА
window.deleteOrder = function(id) {
    if(confirm('Удалить этот заказ?')) {
        let orders = JSON.parse(localStorage.getItem('scooter_orders') || '[]');
        orders = orders.filter(o => o.id !== id);
        localStorage.setItem('scooter_orders', JSON.stringify(orders));
        renderOrders();
    }
}

// ПОЛНАЯ ОЧИСТКА
window.clearAll = function() {
    if(confirm('Внимание! Это удалит ВСЕ заказы из базы. Продолжить?')) {
        localStorage.removeItem('scooter_orders');
        renderOrders();
    }
}

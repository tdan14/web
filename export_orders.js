const orderList = document.getElementById('orderList');

// Dữ liệu mẫu đơn hàng đợi kiểm duyệt
const pendingOrders = [
    { id: 1, store: 'Chi nhánh 1', items: ['Hàng A - 2', 'Hàng B - 3'], price: '500,000 VND', time: '10:30 23/07/2024' },
    { id: 2, store: 'Chi nhánh 2', items: ['Hàng C - 1', 'Hàng D - 4'], price: '300,000 VND', time: '11:45 23/07/2024' },
    { id: 3, store: 'Chi nhánh 3', items: ['Hàng E - 5', 'Hàng F - 2'], price: '700,000 VND', time: '12:00 23/07/2024' }
];

// Hiển thị danh sách đơn hàng
function displayOrders() {
    pendingOrders.forEach(order => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span>Cửa hàng: ${order.store}</span>
            <span>Sản phẩm: ${order.items.join(', ')}</span>
            <span>Giá tiền: ${order.price}</span>
            <span>Giờ mua: ${order.time}</span>
            <button onclick="approveOrder(${order.id})">Duyệt</button>
        `;
        orderList.appendChild(li);
    });
}

// Xử lý duyệt đơn hàng
function approveOrder(orderId) {
    alert(`Đơn hàng ${orderId} đã được duyệt!`);
    // Xóa đơn hàng khỏi danh sách
    const orderIndex = pendingOrders.findIndex(order => order.id === orderId);
    pendingOrders.splice(orderIndex, 1);
    // Cập nhật hiển thị
    orderList.innerHTML = '';
    displayOrders();
}

displayOrders();

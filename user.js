// Biến lưu trữ số lượng hàng tồn kho và giỏ hàng
let inventory = {};
let cart = {};

// Cập nhật số lượng hàng tồn kho và hình ảnh từ server
function updateInventory(products) {
    products.forEach(product => {
        let quantityElement = document.getElementById(`quantity-${product.id}`);
        let imageElement = document.querySelector(`#${product.id} img`);
        let nameElement = document.querySelector(`#${product.id} h3`);
        let quantityInput = document.getElementById(`quantity-input-${product.id}`);

        if (quantityElement && imageElement && nameElement && quantityInput) {
            quantityElement.textContent = product.quantity;
            imageElement.src = product.image;
            nameElement.textContent = product.name;
            quantityInput.textContent = 0; // Khởi tạo số lượng nhập vào là 0
            inventory[product.id] = product.quantity; // Cập nhật số lượng tồn kho
        }
    });
}

// Cập nhật hiển thị giỏ hàng
function updateCart() {
    let cartList = document.getElementById('cart-items');
    cartList.innerHTML = '';
    for (let productId in cart) {
        let quantity = cart[productId];
        let listItem = document.createElement('li');
        listItem.textContent = `${getProductName(productId)}: ${quantity}`;
        cartList.appendChild(listItem);
    }
}

// Xử lý sự kiện khi người dùng thêm hàng vào giỏ hàng
function addToCart(productId) {
    let quantityToAdd = parseInt(document.getElementById(`quantity-input-${productId}`).textContent);
    if (inventory[productId] >= quantityToAdd) {
        if (cart[productId]) {
            cart[productId] += quantityToAdd;
        } else {
            cart[productId] = quantityToAdd;
        }
        inventory[productId] -= quantityToAdd;
        updateInventory(products); // Cập nhật hiển thị số lượng hàng tồn kho
        updateCart(); // Cập nhật giỏ hàng
    } else {
        alert("Số lượng hàng tồn kho hiện tại không thể đáp ứng nhu cầu của khách hàng. Xin hãy thứ lỗi cho sự bất tiện này và điều chỉnh số lượng hàng sao cho phù hợp.");
    }
}

// Xử lý sự kiện giảm số lượng nhập vào giỏ hàng
function decrementQuantity(productId) {
    let quantityInput = document.getElementById(`quantity-input-${productId}`);
    let currentQuantity = parseInt(quantityInput.textContent);
    if (currentQuantity > 0) {
        quantityInput.textContent = currentQuantity - 1;
    }
}

// Xử lý sự kiện tăng số lượng nhập vào giỏ hàng
function incrementQuantity(productId) {
    let quantityInput = document.getElementById(`quantity-input-${productId}`);
    let currentQuantity = parseInt(quantityInput.textContent);
    quantityInput.textContent = currentQuantity + 1;
}

// Tìm kiếm sản phẩm
function searchProducts() {
    let searchInput = document.getElementById('search-input').value.toLowerCase();
    let products = document.querySelectorAll('.product-item');
    products.forEach(product => {
        let productName = product.querySelector('h3').textContent.toLowerCase();
        if (productName.includes(searchInput)) {
            product.style.display = 'block';
        } else {
            product.style.display = 'none';
        }
    });
}

// Lấy tên sản phẩm từ id sản phẩm
function getProductName(productId) {
    switch (productId) {
        case 'product1':
            return 'Con Mèo Ngu';
        case 'product2':
            return 'Con Mèo Ngáo';
        case 'product3':
            return 'Con Mèo Điên';
        default:
            return 'Sản phẩm không xác định';
    }
}

// Khởi tạo trang khi tải
window.onload = () => {
    fetch('/api/products')
        .then(response => response.json())
        .then(products => {
            updateInventory(products); // Cập nhật thông tin sản phẩm
            updateCart(); // Cập nhật giỏ hàng
        })
        .catch(error => console.error('Lỗi tải sản phẩm:', error));
};

// Thêm sản phẩm vào giỏ hàng
function addToCart(productId) {
    const quantityInput = document.getElementById(`quantity-input-${productId}`);
    const quantity = parseInt(quantityInput.textContent);

    // Lưu trữ giỏ hàng vào localStorage
    let cart = JSON.parse(localStorage.getItem('cart')) || {};
    cart[productId] = (cart[productId] || 0) + quantity;
    localStorage.setItem('cart', JSON.stringify(cart));

    alert('Sản phẩm đã được thêm vào giỏ hàng!');
}
// Lấy dữ liệu sản phẩm từ server và cập nhật giao diện người dùng
function fetchProducts() {
    fetch('/api/products')
        .then(response => response.json())
        .then(products => {
            updateInventory(products);
            // ...
        })
        .catch(error => console.error('Lỗi tải sản phẩm:', error));
}

// Thêm sản phẩm vào giỏ hàng và cập nhật số lượng tồn kho
function addToCart(productId) {
    let quantity = parseInt(document.getElementById(`quantity-input-${productId}`).textContent);
    // Cập nhật số lượng sản phẩm trên server
    fetch('/api/update-product', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: productId, quantity: inventory[productId] - quantity })
    })
    .then(response => response.text())
    .then(message => {
        alert(message);
        updateCart();
    })
    .catch(error => console.error('Lỗi cập nhật sản phẩm:', error));
}
// Cập nhật giỏ hàng với số lượng từ localStorage
function updateCart() {
    let cartList = document.getElementById('cart-items');
    cartList.innerHTML = '';
    for (let productId in cart) {
        let quantity = cart[productId];
        let listItem = document.createElement('li');
        listItem.textContent = `${getProductName(productId)}: ${quantity}`;
        cartList.appendChild(listItem);
    }
}

// Gửi đơn hàng đến Arduino
function sendOrderToArduino() {
    let order = [];

    // Lấy dữ liệu từ giỏ hàng
    for (let productId in cart) {
        let quantity = cart[productId];
        if (quantity > 0) {
            order.push({
                id: productId,
                name: getProductName(productId),
                quantity: quantity
            });
        }
    }

    // Gửi dữ liệu đến Arduino
    fetch('/api/send-order', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ order: order })
    })
    .then(response => response.text())
    .then(message => {
        alert(message);
        // Xóa giỏ hàng sau khi gửi
        cart = {};
        updateCart();
    })
    .catch(error => console.error('Lỗi gửi đơn hàng:', error));
}

// Gán sự kiện cho nút "Thanh toán"
document.getElementById('checkout-btn').addEventListener('click', sendOrderToArduino);
// user.js

// Cập nhật số lượng hàng tồn kho và giá tiền từ server
function updateInventory(products) {
    products.forEach(product => {
        let quantityElement = document.getElementById(`quantity-${product.id}`);
        let priceElement = document.getElementById(`price-${product.id}`);
        if (quantityElement && priceElement) {
            quantityElement.textContent = product.quantity;
            priceElement.textContent = `${product.price} VND`;
        }
    });
}

// Hàm gọi API để lấy thông tin sản phẩm từ server
function fetchProductInfo() {
    fetch('/api/products')
        .then(response => response.json())
        .then(products => {
            updateInventory(products);
        })
        .catch(error => console.error('Lỗi tải thông tin sản phẩm:', error));
}

document.addEventListener('DOMContentLoaded', fetchProductInfo);

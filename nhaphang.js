// inventory_management.js

// Xử lý gửi thông tin sản phẩm từ form
document.getElementById('productForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const productName = document.getElementById('productName').value;
    const productImage = document.getElementById('productImage').value;
    const productPrice = document.getElementById('productPrice').value;

    fetch('/api/add-product', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            name: productName,
            image: productImage,
            price: productPrice
        }),
    })
    .then(response => response.json())
    .then(data => {
        alert('Thêm sản phẩm thành công!');
        loadProductList(); // Cập nhật danh sách sản phẩm
    })
    .catch(error => console.error('Lỗi:', error));
});

// Tải danh sách sản phẩm từ server
function loadProductList() {
    fetch('/api/products')
        .then(response => response.json())
        .then(products => {
            const productList = document.getElementById('products');
            productList.innerHTML = '';
            products.forEach(product => {
                const li = document.createElement('li');
                li.textContent = `${product.name} - ${product.price} VND`;
                productList.appendChild(li);
            });
        })
        .catch(error => console.error('Lỗi:', error));
}

// Tải danh sách sản phẩm khi trang được tải
document.addEventListener('DOMContentLoaded', loadProductList);

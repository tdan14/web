// Định nghĩa các biến toàn cục
const notificationList = document.getElementById("notificationList");
const slotX = document.querySelectorAll(".shelf#shelfX .slot");
const slotY = document.querySelectorAll(".shelf#shelfY .slot");
const powerButton = document.getElementById("powerButton");
const emergencyStopButton = document.getElementById("emergencyStop");
const customizeProductsButton = document.getElementById("customizeProducts");
const viewHistoryButton = document.getElementById("viewHistory");
const addStockButton = document.getElementById("addStock");

// Thêm thông báo từ Arduino
function addNotification(message) {
  const li = document.createElement("li");
  li.textContent = message;
  notificationList.appendChild(li);
}

// Gửi tín hiệu đến Arduino qua Fetch
function sendSignalToArduino(signal) {
  fetch("/api/send-signal", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ signal }),
  })
    .then((response) => response.json())
    .then((data) => console.log("Tín hiệu gửi thành công:", data))
    .catch((error) => console.error("Lỗi gửi tín hiệu:", error));
}

// Cập nhật thông tin kho lên server
function updateInventoryOnServer() {
  const inventoryData = {
    shelfX: Array.from(slotX).map((slot) => ({
      name: slot.querySelector(".item-name").textContent,
      quantity: slot.querySelector(".item-quantity").textContent,
    })),
    shelfY: Array.from(slotY).map((slot) => ({
      name: slot.querySelector(".item-name").textContent,
      quantity: slot.querySelector(".item-quantity").textContent,
    })),
  };

  fetch("/api/update-inventory", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(inventoryData),
  })
    .then((response) => response.json())
    .then((data) => console.log("Cập nhật kho thành công:", data))
    .catch((error) => console.error("Lỗi cập nhật kho:", error));
}

// Mô phỏng dữ liệu hàng hóa trên kệ
function simulateInventory() {
  slotX.forEach((slot, index) => {
    const item = slot.querySelector(".item");
    item.querySelector(".item-name").textContent = `Hàng ${String.fromCharCode(
      65 + index
    )}`; // A, B, C, ...
    item.querySelector(".item-quantity").textContent =
      Math.floor(Math.random() * 20) + 1;
  });

  slotY.forEach((slot, index) => {
    const item = slot.querySelector(".item");
    item.querySelector(".item-name").textContent = `Hàng ${String.fromCharCode(
      74 + index
    )}`; // J, K, L, ...
    item.querySelector(".item-quantity").textContent =
      Math.floor(Math.random() * 20) + 1;
  });
}

// Cập nhật thông báo từ Arduino
function updateNotifications() {
  fetch("/api/get-notifications")
    .then((response) => response.json())
    .then((notifications) => {
      notifications.forEach((notification) => {
        addNotification(notification.message);
      });
    })
    .catch((error) => console.error("Lỗi tải thông báo:", error));
}

// Khởi tạo trang
function initializePage() {
  simulateInventory();
  updateNotifications();
  updateInventoryOnServer(); // Cập nhật kho lên server khi trang tải xong
}

// Xử lý nhập hàng
function handleAddStock() {
  addNotification("Hệ thống đang bắt đầu nhập hàng");
  sendSignalToArduino("START_INPUT_CONVEYOR");
  console.log(
    "Đang lấy dữ liệu từ trang quản lý kho và đưa hàng đến vị trí mong muốn."
  );
}

// Thêm sự kiện cho các nút điều khiển
powerButton.addEventListener("click", () => {
  fetch("/api/toggle-power", { method: "POST" })
    .then((response) => response.json())
    .then((data) => {
      alert("Hệ thống đã được bật/tắt.");
      updateNotifications();
      updateInventoryOnServer(); // Cập nhật kho khi hệ thống được bật/tắt
    })
    .catch((error) => console.error("Lỗi khi bật/tắt hệ thống:", error));
});

emergencyStopButton.addEventListener("click", () => {
  fetch("/api/emergency-stop", { method: "POST" })
    .then((response) => response.json())
    .then((data) => {
      alert("Hệ thống đã dừng khẩn cấp.");
      updateNotifications();
      updateInventoryOnServer(); // Cập nhật kho khi dừng khẩn cấp
    })
    .catch((error) => console.error("Lỗi khi dừng khẩn cấp:", error));
});

customizeProductsButton.addEventListener("click", () => {
  window.location.href = "inventory_management.html";
});

viewHistoryButton.addEventListener("click", () => {
  window.location.href = "history.html";
});

addStockButton.addEventListener("click", () => {
  window.location.href = "nhaphang.html";
});

document.getElementById("exportOrders").addEventListener("click", () => {
  window.location.href = "export_orders.html";
});

addStockButton.addEventListener("click", handleAddStock);

document.addEventListener("DOMContentLoaded", initializePage);
// Cập nhật số lượng hàng hóa từ server
function fetchProducts() {
  fetch("/api/products")
    .then((response) => response.json())
    .then((products) => {
      // Hiển thị sản phẩm trên giao diện admin
      // ...
    })
    .catch((error) => console.error("Lỗi tải sản phẩm:", error));
}

// Cập nhật số lượng sản phẩm qua API
function updateProduct(id, quantity) {
  fetch("/api/update-product", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id, quantity }),
  })
    .then((response) => response.text())
    .then((message) => {
      alert(message);
      fetchProducts(); // Cập nhật lại danh sách sản phẩm sau khi cập nhật
    })
    .catch((error) => console.error("Lỗi cập nhật sản phẩm:", error));
}
const express = require("express");
const cors = require("cors");
const app = express();
const port = 3000;

// Cấu hình middleware
app.use(cors());
app.use(express.json());

// Dữ liệu mẫu sản phẩm
const products = [
  {
    id: "product1",
    name: "Con Mèo Ngu",
    quantity: 100,
    image: "path/to/image1.jpg",
  },
  {
    id: "product2",
    name: "Con Mèo Ngáo",
    quantity: 50,
    image: "path/to/image2.jpg",
  },
  {
    id: "product3",
    name: "Con Mèo Điên",
    quantity: 75,
    image: "path/to/image3.jpg",
  },
];

// API endpoint để lấy danh sách sản phẩm
app.get("/api/products", (req, res) => {
  res.json(products);
});

// Khởi động server
app.listen(port, () => {
  console.log(`Server chạy trên http://localhost:${port}`);
});
// admin.js

// Cập nhật thông tin sản phẩm từ trang quản lý hàng hóa
function handleProductFormSubmit(event) {
  event.preventDefault();
  const productName = document.getElementById("productName").value;
  const productImage = document.getElementById("productImage").value;
  const productPrice = document.getElementById("productPrice").value;

  fetch("/api/add-product", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: productName,
      image: productImage,
      price: productPrice,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      alert("Thêm sản phẩm thành công");
      updateProductList(); // Cập nhật danh sách sản phẩm trên trang quản lý
    })
    .catch((error) => console.error("Lỗi thêm sản phẩm:", error));
}

// Cập nhật danh sách sản phẩm trên trang quản lý
function updateProductList() {
  fetch("/api/products")
    .then((response) => response.json())
    .then((products) => {
      const productList = document.getElementById("products");
      productList.innerHTML = "";
      products.forEach((product) => {
        const li = document.createElement("li");
        li.textContent = `${product.name} - ${product.price} VND`;
        productList.appendChild(li);
      });
    })
    .catch((error) => console.error("Lỗi tải sản phẩm:", error));
}

document
  .getElementById("productForm")
  .addEventListener("submit", handleProductFormSubmit);

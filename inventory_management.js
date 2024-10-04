// Dữ liệu mẫu cho các kệ hàng
const shelves = [
  { shelfID: 1, items: ["", "", "", "", "", "", "", "", ""] },
  { shelfID: 2, items: ["", "", "", "", "", "", "", "", ""] },
];

// Hàm hiển thị các kệ hàng
function displayShelves() {
  const shelf1 = document.getElementById("shelf1");
  const shelf2 = document.getElementById("shelf2");

  shelves[0].items.forEach((item, index) => {
    const div = document.createElement("div");
    div.className = "grid-item";
    div.id = `shelf1-item${index + 1}`;
    div.textContent = item;
    shelf1.appendChild(div);
  });

  shelves[1].items.forEach((item, index) => {
    const div = document.createElement("div");
    div.className = "grid-item";
    div.id = `shelf2-item${index + 1}`;
    div.textContent = item;
    shelf2.appendChild(div);
  });
}

// Hàm khai báo loại hàng
function declareItem() {
  const shelfID = parseInt(document.getElementById("shelfID").value);
  const type = document.getElementById("type").value;

  if (shelfID >= 1 && shelfID <= 18 && type) {
    let shelf, shelfIndex, itemIndex;

    if (shelfID <= 9) {
      shelf = shelves[0];
      shelfIndex = shelfID - 1;
      itemIndex = shelfIndex;
    } else {
      shelf = shelves[1];
      shelfIndex = shelfID - 10;
      itemIndex = shelfIndex;
    }

    if (shelf.items[itemIndex] === "") {
      shelf.items[itemIndex] = type;
      document.getElementById(
        `shelf${shelfID <= 9 ? 1 : 2}-item${shelfIndex + 1}`
      ).textContent = type;
    } else {
      alert("Ô hàng này đã có loại hàng.");
    }
  } else {
    alert("Vui lòng nhập ID kệ hàng hợp lệ (1-18) và loại hàng.");
  }
}

// Gọi hàm để hiển thị các kệ hàng khi tải trang
window.onload = displayShelves;

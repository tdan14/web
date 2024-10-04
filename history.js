// Hàm để lấy dữ liệu lịch sử từ Arduino và hiển thị trên bảng
async function fetchHistory(startDate, endDate) {
  try {
      const response = await fetch(`/api/history?startDate=${startDate}&endDate=${endDate}`);
      const data = await response.json();
      updateHistoryTable(data);
  } catch (error) {
      console.error('Lỗi khi lấy dữ liệu lịch sử:', error);
  }
}

// Hàm để cập nhật bảng lịch sử
function updateHistoryTable(data) {
  const tableBody = document.getElementById('historyTable').getElementsByTagName('tbody')[0];
  tableBody.innerHTML = '';

  data.forEach(record => {
      const row = document.createElement('tr');

      const nameCell = document.createElement('td');
      nameCell.textContent = record.name;
      row.appendChild(nameCell);

      const codeCell = document.createElement('td');
      codeCell.textContent = record.code;
      row.appendChild(codeCell);

      const quantityCell = document.createElement('td');
      quantityCell.textContent = record.quantity;
      row.appendChild(quantityCell);

      const timeCell = document.createElement('td');
      timeCell.textContent = record.time;
      row.appendChild(timeCell);

      const typeCell = document.createElement('td');
      typeCell.textContent = record.type;
      row.appendChild(typeCell);

      tableBody.appendChild(row);
  });
}

// Xử lý sự kiện khi form được gửi
document.getElementById('dateForm').addEventListener('submit', (event) => {
  event.preventDefault();
  const startDate = document.getElementById('startDate').value;
  const endDate = document.getElementById('endDate').value;
  fetchHistory(startDate, endDate);
});

// Hàm để xuất dữ liệu ra Excel
document.getElementById('exportExcel').addEventListener('click', () => {
  const table = document.getElementById('historyTable');
  const wb = XLSX.utils.table_to_book(table);
  XLSX.writeFile(wb, 'lich_su_xuat_nhap_kho.xlsx');
});

// Hàm để xuất dữ liệu ra PDF
document.getElementById('exportPDF').addEventListener('click', () => {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  const table = document.getElementById('historyTable');
  const rows = [];

  for (let i = 0, row; row = table.rows[i]; i++) {
      const col = [];
      for (let j = 0, cell; cell = row.cells[j]; j++) {
          col.push(cell.innerText);
      }
      rows.push(col);
  }

  doc.autoTable({
      head: [rows[0]],
      body: rows.slice(1)
  });

  doc.save('lich_su_xuat_nhap_kho.pdf');
});

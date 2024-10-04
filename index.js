document.getElementById('onButton').addEventListener('click', () => {
    fetch('http://192.168.1.182/on')
      .then(response => response.text())
      .then(data => alert(data))
      .catch(error => console.error('Error:', error));
  });
  
  document.getElementById('offButton').addEventListener('click', () => {
    fetch('http://192.168.1.182/off')
      .then(response => response.text())
      .then(data => alert(data))
      .catch(error => console.error('Error:', error));
  });
  
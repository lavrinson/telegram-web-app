document.addEventListener('DOMContentLoaded', () => {
    fetch('header.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('header-section').innerHTML = data;
            const coins = localStorage.getItem('coins') || 0;
            document.getElementById('coin-count').textContent = coins;
        })
        .catch(error => console.error('Ошибка загрузки header:', error));

    fetch('footer.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('footer-section').innerHTML = data;  // Исправлено
        })
        .catch(error => console.error('Ошибка загрузки footer:', error));
});

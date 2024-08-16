document.addEventListener('DOMContentLoaded', () => {
    // Загружаем header
    fetch('header.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('header-section').innerHTML = data;
            // После загрузки header, обновляем прогресс
            const coins = localStorage.getItem('coins') || 0;
            document.getElementById('coin-count').textContent = coins;
        })
        .catch(error => console.error('Ошибка загрузки header:', error));

    // Загружаем footer
    fetch('footer.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('footer-section').innerHTML = data;
        })
        .catch(error => console.error('Ошибка загрузки footer:', error));
});

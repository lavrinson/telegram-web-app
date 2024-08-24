document.addEventListener('DOMContentLoaded', function() {
    function loadUserInfo() {
        fetch('/user-info.html') // Загружаем HTML файл блока пользователя
            .then(response => response.text())
            .then(html => {
                // Вставляем блок пользователя перед основным контентом
                document.querySelector('body').insertAdjacentHTML('afterbegin', html);
                updateCoins();
            })
            .catch(error => console.error('Ошибка при загрузке блока пользователя:', error));
    }

    function updateCoins() {
        fetch('/auth/telegram/callback', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: 'your_user_id' // Замените 'your_user_id' на реальный ID пользователя
            })
        })
        .then(response => response.json())
        .then(data => {
            document.querySelector('.user-name').textContent = data.username || 'Username';
            document.getElementById('coin-count').textContent = data.coin_count || 0;
        })
        .catch(error => console.error('Ошибка при загрузке данных пользователя:', error));
    }

    loadUserInfo();
});

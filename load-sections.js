document.addEventListener('DOMContentLoaded', () => {
    // Загрузка header
    fetch('header.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('header-section').innerHTML = data;

            // Получение данных из localStorage (если они есть)
            const coins = localStorage.getItem('coins') || 0;
            document.getElementById('coin-count').textContent = coins;
        })
        .catch(error => console.error('Ошибка загрузки header:', error));

    // Загрузка footer
    fetch('footer.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('footer-section').innerHTML = data;
        })
        .catch(error => console.error('Ошибка загрузки footer:', error));

    // Автоматическая авторизация через Telegram Web App
    Telegram.WebApp.ready();

    // Обработка события авторизации Telegram
    Telegram.WebApp.onEvent('auth', function(user) {
        fetch('/auth/telegram/callback', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: user.id,
                username: user.username,
                photo_url: user.photo_url
            })
        })
        .then(response => response.json())
        .then(data => {
            // Обновление интерфейса с данными пользователя
            document.getElementById('user-avatar').src = data.avatar_url;
            document.querySelector('.user-name').textContent = data.username;
            document.getElementById('coin-count').textContent = data.coin_count;
            document.getElementById('energy-count').textContent = `${data.energy_count} / ${data.max_energy}`;
        })
        .catch(error => console.error('Ошибка при авторизации через Telegram:', error));
    });

    // Пример использования данных Telegram Web App API
    Telegram.WebApp.onEvent('init', function() {
        console.log('Web App готов к работе!');
    });
});

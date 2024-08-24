document.addEventListener('DOMContentLoaded', function() {
    try {
        fetch('/auth/telegram/callback', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: 'your_user_id' // Здесь замените 'your_user_id' на реальный ID пользователя, полученный из Telegram API
            })
        })
        .then(response => response.json())
        .then(data => {
            document.querySelector('.user-name').textContent = data.username || 'Username';
            document.getElementById('coin-count').textContent = data.coin_count || 0;
        })
        .catch(error => console.error('Ошибка при загрузке данных пользователя:', error));
    } catch (error) {
        console.error('Ошибка при выполнении скрипта:', error);
    }
});

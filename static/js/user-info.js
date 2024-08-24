document.addEventListener('DOMContentLoaded', function() {
    try {
        fetch('/auth/telegram/callback', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: 'user_id' // Здесь должен быть реальный ID пользователя, полученный из Telegram
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Ошибка HTTP: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            document.querySelector('.user-name').textContent = data.username || 'Username';
            document.getElementById('coin-count').textContent = data.coin_count || 0;
        })
        .catch(error => console.error('Ошибка при загрузке данных пользователя:', error));
    } catch (error) {
        console.error('Ошибка при выполнении скрипта:', error);
    }
});

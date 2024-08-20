async function loadGameState() {
    try {
        // Пытаемся загрузить данные пользователя через Telegram API
        const user = await window.Telegram.WebApp.getUser();
        console.log('User data:', user);  // Логируем данные пользователя для отладки
        document.querySelector('.user-name').textContent = user.username || 'Guest';
        document.getElementById('user-avatar').src = user.photo_url || 'default-avatar.png';
        document.getElementById('user-avatar').style.display = 'block';
    } catch (error) {
        console.error('Ошибка при загрузке данных пользователя:', error);
        document.querySelector('.user-name').textContent = 'Guest';
        document.getElementById('user-avatar').style.display = 'none';
    }

    coinCount = parseInt(localStorage.getItem('coinCount'), 10) || 1500;
    energyCount = parseInt(localStorage.getItem('energyCount'), 10) || 2000;
    recoveriesLeft = parseInt(localStorage.getItem('recoveriesLeft'), 10) || 20;
    nextRecoveryTime = localStorage.getItem('nextRecoveryTime') ? new Date(parseInt(localStorage.getItem('nextRecoveryTime'), 10)) : null;
    updateDisplay();
}

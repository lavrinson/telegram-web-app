async function loadGameState() {
    try {
        // Используем initDataUnsafe для получения данных пользователя
        const user = window.Telegram.WebApp.initDataUnsafe.user;
        if (user) {
            console.log('User data:', user);  // Логируем данные пользователя для отладки
            document.querySelector('.user-name').textContent = user.username || 'Guest';
            document.getElementById('user-avatar').src = user.photo_url || 'default-avatar.png';
            document.getElementById('user-avatar').style.display = 'block';
        } else {
            console.log('User data not available');
            document.querySelector('.user-name').textContent = 'Guest';
            document.getElementById('user-avatar').style.display = 'none';
        }
    } catch (error) {
        console.error('Ошибка при загрузке данных пользователя:', error);
        document.querySelector('.user-name').textContent = 'Guest';
        document.getElementById('user-avatar').style.display = 'none';
    }

    // Остальная логика загрузки состояния игры
    coinCount = parseInt(localStorage.getItem('coinCount'), 10) || 1500;
    energyCount = parseInt(localStorage.getItem('energyCount'), 10) || 2000;
    recoveriesLeft = parseInt(localStorage.getItem('recoveriesLeft'), 10) || 20;
    nextRecoveryTime = localStorage.getItem('nextRecoveryTime') ? new Date(parseInt(localStorage.getItem('nextRecoveryTime'), 10)) : null;
    updateDisplay();
}

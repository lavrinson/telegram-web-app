document.addEventListener('DOMContentLoaded', function() {
    // Загрузка данных пользователя
    const userNameElement = document.querySelector('.user-name');
    const coinCountElement = document.getElementById('coin-count');
    const miningTimerElement = document.getElementById('mining-timer');

    // Пример данных пользователя (вы можете заменить их реальными данными)
    const userData = {
        userName: 'John Doe',
        coins: 150,
        nextClaimTime: '00:15:30'
    };

    // Обновление UI данными пользователя
    userNameElement.textContent = userData.userName;
    coinCountElement.textContent = `Coins: ${userData.coins}`;
    miningTimerElement.textContent = `Next claim in: ${userData.nextClaimTime}`;

    // Логика для кнопки "Start Mining"
    const miningButton = document.getElementById('mining-button');
    miningButton.disabled = false; // Делаем кнопку активной
    miningButton.addEventListener('click', function() {
        miningButton.textContent = 'Mining...'; // Изменение текста на кнопке
        miningButton.disabled = true; // Отключаем кнопку на время майнинга
        setTimeout(function() {
            alert('Mining completed!');
            miningButton.textContent = 'Start Mining';
            miningButton.disabled = false; // Включаем кнопку снова
        }, 5000); // Имитация времени майнинга в 5 секунд
    });
});

// Переменные для хранения количества кликов, монет и энергии
let coinCount = 1500;
let energyCount = 2000;
const maxEnergy = 2000;
const energyRecoveryRate = 15 * 60 * 1000; // Восстановление полной энергии за 15 минут
let recoveriesLeft = 20; // Максимум восстановлений энергии в сутки
let nextRecoveryTime = null; // Начинаем с null, так как восстановление начинается после исчерпания энергии

// Элементы страницы
const pizzaClicker = document.getElementById('pizza-clicker');
const coinCountElement = document.getElementById('coin-count');
const energyCountElement = document.getElementById('energy-count');
const energyTimerElement = document.getElementById('energy-timer');

// Загрузка сохраненного состояния игры из localStorage
function loadGameState() {
    const savedCoinCount = localStorage.getItem('coinCount');
    const savedEnergyCount = localStorage.getItem('energyCount');
    const savedRecoveriesLeft = localStorage.getItem('recoveriesLeft');
    const savedNextRecoveryTime = localStorage.getItem('nextRecoveryTime');

    if (savedCoinCount) coinCount = parseInt(savedCoinCount, 10);
    if (savedEnergyCount) energyCount = parseInt(savedEnergyCount, 10);
    if (savedRecoveriesLeft) recoveriesLeft = parseInt(savedRecoveriesLeft, 10);
    if (savedNextRecoveryTime) nextRecoveryTime = new Date(parseInt(savedNextRecoveryTime, 10));

    updateDisplay();
}

// Обновление отображения на экране
function updateDisplay() {
    coinCountElement.textContent = coinCount;
    energyCountElement.textContent = `${energyCount} / ${maxEnergy}`;

    if (energyCount < maxEnergy && recoveriesLeft > 0) {
        if (nextRecoveryTime && new Date() >= nextRecoveryTime) {
            energyCount = Math.min(maxEnergy, energyCount + 50); // Увеличиваем энергию на 50
            nextRecoveryTime = new Date(new Date().getTime() + energyRecoveryRate);
            recoveriesLeft -= 1;
        }
        updateEnergyTimer();
    } else {
        energyTimerElement.textContent = '';
    }

    localStorage.setItem('coinCount', coinCount);
    localStorage.setItem('energyCount', energyCount);
    localStorage.setItem('recoveriesLeft', recoveriesLeft);
    localStorage.setItem('nextRecoveryTime', nextRecoveryTime ? nextRecoveryTime.getTime() : null);
}

// Обновление таймера восстановления энергии
function updateEnergyTimer() {
    if (nextRecoveryTime) {
        const now = new Date();
        const timeRemaining = nextRecoveryTime - now;
        if (timeRemaining > 0) {
            const minutes = Math.floor((timeRemaining % (1000 * 3600)) / (1000 * 60));
            const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);
            energyTimerElement.textContent = `Восстановление через ${minutes}m ${seconds}s`;
        } else {
            energyTimerElement.textContent = 'Энергия восстановлена!';
            updateDisplay();
        }
    }
}

// Обработка кликов на пиццу
pizzaClicker.addEventListener('click', () => {
    if (energyCount > 0) {
        coinCount += 10; // Увеличиваем количество монет
        energyCount -= 1; // Уменьшаем количество энергии
        updateDisplay();
    } else {
        alert('Ваша энергия истощена. Попробуйте восстановить энергию.');
    }
});

// Загрузка состояния игры при загрузке страницы
window.onload = loadGameState;

// Обновление таймера каждую секунду
setInterval(updateEnergyTimer, 1000);

// Функция для авторизации через Telegram
function onTelegramAuth(user) {
    fetch('/auth/telegram/callback', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Сетевая ошибка');
        }
        return response.json();
    })
    .then(data => {
        coinCount = data.coin_count;
        energyCount = data.energy_count;
        recoveriesLeft = data.recoveries_left;
        nextRecoveryTime = data.next_recovery_time || null;

        updateDisplay();
    })
    .catch(error => console.error('Ошибка:', error));
}

let coinCount = 1500;
let energyCount = 2000;
const maxEnergy = 2000;
const energyRecoveryRate = 15 * 60 * 1000;
let recoveriesLeft = 20;
let nextRecoveryTime = null;
let boostActive = false;
const boostMultiplier = 2;
const boostDuration = 10000;

const pandaClicker = document.getElementById('panda-clicker');
const coinCountElement = document.getElementById('coin-count');
const energyCountElement = document.getElementById('energy-count');

function loadGameState() {
    coinCount = parseInt(localStorage.getItem('coinCount'), 10) || 1500;
    energyCount = parseInt(localStorage.getItem('energyCount'), 10) || 2000;
    recoveriesLeft = parseInt(localStorage.getItem('recoveriesLeft'), 10) || 20;
    nextRecoveryTime = localStorage.getItem('nextRecoveryTime') ? new Date(parseInt(localStorage.getItem('nextRecoveryTime'), 10)) : null;
    updateDisplay();
}

function updateDisplay() {
    coinCountElement.textContent = formatNumber(coinCount);
    energyCountElement.textContent = `${energyCount} / ${maxEnergy}`;
    if (energyCount < maxEnergy && recoveriesLeft > 0 && nextRecoveryTime && new Date() >= nextRecoveryTime) {
        energyCount = Math.min(maxEnergy, energyCount + 50);
        nextRecoveryTime = new Date(Date.now() + energyRecoveryRate);
        recoveriesLeft -= 1;
        updateEnergyTimer();
    }
    localStorage.setItem('coinCount', coinCount);
    localStorage.setItem('energyCount', energyCount);
    localStorage.setItem('recoveriesLeft', recoveriesLeft);
    localStorage.setItem('nextRecoveryTime', nextRecoveryTime ? nextRecoveryTime.getTime() : null);
}

function formatNumber(value) {
    if (value >= 1000000) return (value / 1000000).toFixed(1) + 'm';
    if (value >= 1000) return (value / 1000).toFixed(1) + 'k';
    return value.toString();
}

pandaClicker.addEventListener('click', () => {
    if (energyCount > 0) {
        const reward = boostActive ? 10 * boostMultiplier : 10;
        coinCount += reward;
        energyCount -= 1;
        updateDisplay();
    } else {
        alert('Ваша энергия истощена. Попробуйте восстановить энергию.');
    }
});

// Авторизация через Telegram
window.TelegramLoginWidget = {
    onAuth: onTelegramAuth
};

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
        console.log('Auth Data:', data);
        coinCount = data.coin_count;
        energyCount = data.energy_count;
        recoveriesLeft = data.recoveries_left;
        nextRecoveryTime = data.next_recovery_time ? new Date(data.next_recovery_time) : null;
        updateDisplay();
    })
    .catch(error => console.error('Ошибка:', error));
}

window.onload = loadGameState;
setInterval(updateDisplay, 1000);
function updateUserInfo(userData) {
    const avatarElement = document.getElementById('user-avatar');
    const usernameElement = document.querySelector('.user-name');

    if (userData.photo_url) {
        avatarElement.src = userData.photo_url;
    }

    usernameElement.textContent = userData.username || 'No Name';
}

// Пример использования функции updateUserInfo после получения данных о пользователе:
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
        console.log('Auth Data:', data);
        coinCount = data.coin_count;
        energyCount = data.energy_count;
        recoveriesLeft = data.recoveries_left;
        nextRecoveryTime = data.next_recovery_time ? new Date(data.next_recovery_time) : null;
        updateUserInfo(data);  // Обновляем информацию о пользователе в интерфейсе
        updateDisplay();
    })
    .catch(error => console.error('Ошибка:', error));
}

// script.js
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

async function loadGameState() {
    try {
        // Пытаемся загрузить данные пользователя через Telegram API
        const user = await window.Telegram.WebApp.getUser();
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

function updateDisplay() {
    coinCountElement.textContent = `Coins: ${formatNumber(coinCount)}`;
    energyCountElement.textContent = `Energy: ${energyCount} / ${maxEnergy}`;
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

window.onload = loadGameState;

setInterval(updateDisplay, 1000);

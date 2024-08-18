let coinCount = 1500;
let energyCount = 2000;
const maxEnergy = 2000;
const energyRecoveryRate = 15 * 60 * 1000;
let recoveriesLeft = 20;
let nextRecoveryTime = null;
let boostActive = false;
const boostMultiplier = 2;
const boostDuration = 10000;

const pizzaClicker = document.getElementById('pizza-clicker');
const coinCountElement = document.getElementById('coin-count');
const energyCountElement = document.getElementById('energy-count');
const energyTimerElement = document.getElementById('energy-timer');
const pandaClicker = document.getElementById('panda-clicker');
const boostButton = document.getElementById('boost-button');
const boostModal = document.getElementById('boost-modal');
const closeButton = document.querySelector('.close-button');
const confirmBoostButton = document.getElementById('confirm-boost');

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

function formatNumber(value) {
    if (value >= 1000000) return (value / 1000000).toFixed(1) + 'm';
    if (value >= 1000) return (value / 1000).toFixed(1) + 'k';
    return value.toString();
}

pizzaClicker.addEventListener('click', () => {
    if (energyCount > 0) {
        coinCount += 10;
        energyCount -= 1;
        updateDisplay();
    } else {
        alert('Ваша энергия истощена. Попробуйте восстановить энергию.');
    }
});

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

boostButton.addEventListener('click', () => {
    boostModal.style.display = 'block';
});

closeButton.addEventListener('click', () => {
    boostModal.style.display = 'none';
});

confirmBoostButton.addEventListener('click', () => {
    if (!boostActive) {
        boostActive = true;
        boostModal.style.display = 'none';
        boostButton.disabled = true;
        setTimeout(() => {
            boostActive = false;
            boostButton.disabled = false;
        }, boostDuration);
    }
});

window.onload = loadGameState;
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
        console.log('Auth Data:', data);
        coinCount = data.coin_count;
        energyCount = data.energy_count;
        recoveriesLeft = data.recoveries_left;
        nextRecoveryTime = data.next_recovery_time ? new Date(data.next_recovery_time) : null;
        updateDisplay();
    })
    .catch(error => console.error('Ошибка:', error));
}

window.TelegramLoginWidget = {
    onAuth: onTelegramAuth
};

(function() {
    const script = document.createElement('script');
    script.src = 'https://telegram.org/js/telegram-widget.js?7';
    script.setAttribute('data-telegram-login', 'crypto_drell_bot');
    script.setAttribute('data-size', 'large');
    script.setAttribute('data-auth-url', 'https://lavrinson.github.io/telegram-web-app/');
    script.setAttribute('data-request-access', 'write');
    document.getElementById('telegram-login').appendChild(script);
})();

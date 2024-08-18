let coins = 1500;
let energy = 2000;
const maxEnergy = 2000;
const energyRecoveryRate = 15 * 60 * 1000;
let recoveriesLeft = 20;
let nextRecoveryTime = null;
let boostActive = false;
const boostMultiplier = 2;
const boostDuration = 10000;

const pandaClicker = document.getElementById('panda-clicker');
const energyCountElement = document.getElementById('energy-count');
const boostButton = document.getElementById('boost-button');
const boostModal = document.getElementById('boost-modal');
const closeButton = document.querySelector('.close-button');
const confirmBoostButton = document.getElementById('confirm-boost');

function loadGameState() {
    coins = parseInt(localStorage.getItem('coinCount'), 10) || 1500;
    energy = parseInt(localStorage.getItem('energyCount'), 10) || 2000;
    recoveriesLeft = parseInt(localStorage.getItem('recoveriesLeft'), 10) || 20;
    nextRecoveryTime = localStorage.getItem('nextRecoveryTime') ? new Date(parseInt(localStorage.getItem('nextRecoveryTime'), 10)) : null;
    updateDisplay();
}

function updateDisplay() {
    energyCountElement.textContent = `${energy} / ${maxEnergy}`;
    document.getElementById('coin-count').textContent = formatNumber(coins);
    if (energy < maxEnergy && recoveriesLeft > 0 && nextRecoveryTime && new Date() >= nextRecoveryTime) {
        energy = Math.min(maxEnergy, energy + 50);
        nextRecoveryTime = new Date(Date.now() + energyRecoveryRate);
        recoveriesLeft -= 1;
        updateEnergyTimer();
    }
    localStorage.setItem('coinCount', coins);
    localStorage.setItem('energyCount', energy);
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
            energyCountElement.textContent = `Восстановление через ${minutes}m ${seconds}s`;
        } else {
            energyCountElement.textContent = 'Энергия восстановлена!';
            updateDisplay();
        }
    }
}

function formatNumber(value) {
    if (value >= 1000000) return (value / 1000000).toFixed(1) + 'm';
    if (value >= 1000) return (value / 1000).toFixed(1) + 'k';
    return value.toString();
}

pandaClicker.addEventListener('click', () => {
    if (energy > 0) {
        coins += boostActive ? 20 : 10;
        energy -= 1;
        updateDisplay();
    } else {
        alert('Ваши ресурсы истощены. Попробуйте восстановить ресурсы.');
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

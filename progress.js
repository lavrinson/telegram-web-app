let coins = 0;
let energy = 0;
const maxEnergy = 2000;

const saveProgress = (key, value) => {
    localStorage.setItem(key, value);
};

const loadProgress = (key, defaultValue) => {
    const savedValue = localStorage.getItem(key);
    return savedValue !== null ? parseInt(savedValue, 10) : defaultValue;
};

const updateDisplay = () => {
    document.getElementById('coin-count').textContent = coins;
    document.getElementById('energy-count').textContent = ${energy} / ${maxEnergy};
};

document.addEventListener('DOMContentLoaded', () => {
    coins = loadProgress('coins', 3500);
    energy = loadProgress('energy', 1800);
    updateDisplay();

    const pizzaClicker = document.getElementById('pizza-clicker');
    if (pizzaClicker) {
        pizzaClicker.addEventListener('click', (event) => {
            event.preventDefault();
            if (energy > 0) {
                coins += 1;
                energy -= 1;
                updateDisplay();
                saveProgress('coins', coins);
                saveProgress('energy', energy);
            } else {
                alert('Your energy is depleted. Try to restore energy.');
            }
        });

        // Восстановление энергии с таймером
        const energyRecoveryRate = 2 * 1000; // 1 энергия каждые 2 секунды
        setInterval(() => {
            if (energy < maxEnergy) {
                energy += 1;
                updateDisplay();
                saveProgress('energy', energy);
            }
        }, energyRecoveryRate);
    }
});
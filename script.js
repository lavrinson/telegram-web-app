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

// Обработчик кликов по кнопке с изображением пиццы
pizzaClicker.addEventListener('click', () => {
    if (energyCount > 0) {
        coinCount += 1; // Увеличиваем количество монет
        energyCount -= 1; // Уменьшаем количество энергии

        // Обновляем отображение на странице
        coinCountElement.textContent = coinCount;
        energyCountElement.textContent = `${energyCount} / ${maxEnergy}`;

        // Если энергия исчерпана, запускаем таймер восстановления
        if (energyCount === 0) {
            nextRecoveryTime = Date.now() + energyRecoveryRate;
        }
    }
});

// Функция обновления таймера восстановления энергии
function updateEnergyTimer() {
    if (nextRecoveryTime !== null) {
        const now = Date.now();
        const timeLeft = nextRecoveryTime - now;

        if (timeLeft > 0) {
            const minutes = Math.floor(timeLeft / (1000 * 60));
            const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
            energyTimerElement.textContent = `Восстановление через: ${minutes}м ${seconds}с`;
        } else {
            energyTimerElement.textContent = "Восстановление...";
        }
    } else {
        energyTimerElement.textContent = "Энергия на максимуме";
    }
}

// Функция восстановления энергии
function recoverEnergy() {
    const now = Date.now();
    if (nextRecoveryTime !== null && now >= nextRecoveryTime && energyCount < maxEnergy && recoveriesLeft > 0) {
        energyCount = maxEnergy; // Полностью восстанавливаем энергию
        recoveriesLeft -= 1; // Уменьшаем количество доступных восстановлений
        nextRecoveryTime = null; // Останавливаем таймер восстановления

        // Обновляем отображение энергии
        energyCountElement.textContent = `${energyCount} / ${maxEnergy}`;
    }
}

// Запускаем обновление таймера и восстановления энергии каждые 1 секунду
setInterval(() => {
    recoverEnergy();
    updateEnergyTimer();
}, 1000);

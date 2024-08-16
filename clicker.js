document.addEventListener('DOMContentLoaded', () => {
    const initClicker = () => {
        let coins = loadProgress('coins', 0);
        let energy = loadProgress('energy', 2000);
        const maxEnergy = 2000;

        // Обновляем отображение начальных значений
        document.getElementById('coin-count').textContent = coins;
        document.getElementById('energy-count').textContent = `${energy} / ${maxEnergy}`;

        // Логика для клика по пицце
        const pizzaClicker = document.getElementById('pizza-clicker');
        pizzaClicker.addEventListener('click', (event) => {
            event.preventDefault();
            if (energy > 0) {
                coins += 1; // Увеличиваем количество монет на 1
                energy -= 1;
                document.getElementById('coin-count').textContent = coins;
                document.getElementById('energy-count').textContent = `${energy} / ${maxEnergy}`;
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
                energy += 1; // Восстанавливаем 1 единицу энергии
                document.getElementById('energy-count').textContent = `${energy} / ${maxEnergy}`;
                saveProgress('energy', energy);
            }
        }, energyRecoveryRate);
    };

    // Проверка, что секции загрузились перед инициализацией кликера
    const checkSectionsLoaded = setInterval(() => {
        if (document.getElementById('user-avatar') && document.getElementById('pizza-clicker')) {
            clearInterval(checkSectionsLoaded);
            initClicker();
        }
    }, 100);
});

// Функции для загрузки и сохранения прогресса
function loadProgress(key, defaultValue) {
    const value = localStorage.getItem(key);
    return value !== null ? parseInt(value, 10) : defaultValue;
}

function saveProgress(key, value) {
    localStorage.setItem(key, value);
}

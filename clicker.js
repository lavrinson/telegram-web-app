document.addEventListener('DOMContentLoaded', () => {
    const initClicker = () => {
        let coins = loadProgress('coins', 3500);
        let energy = loadProgress('energy', 1800);
        const maxEnergy = 2000;
        const pandaImg = document.getElementById('panda-img');

        // Обновляем отображение начальных значений
        document.getElementById('coin-count').textContent = coins;
        document.getElementById('energy-count').textContent = `${energy} / ${maxEnergy}`;
        pandaImg.src = 'assets/icons/panda-shocked.png'; // Начальное изображение панды

        // Логика для клика и касания по пандочке
        const pandaClicker = document.getElementById('panda-clicker');

        // Обновление изображения панды в зависимости от энергии
        const updatePandaImage = () => {
            if (energy <= 0) {
                pandaImg.src = 'assets/icons/panda-thinking.png'; // Изображение при исчерпании энергии
            } else if (pandaClicker.classList.contains('pressed')) {
                pandaImg.src = 'assets/icons/panda-money.png'; // Изображение при зажатии
            } else {
                pandaImg.src = 'assets/icons/panda-shocked.png'; // Обычное изображение
            }
        };

        // Обработчик для изменения изображения при касании
        const handleTouchStart = () => {
            pandaClicker.classList.add('pressed');
            updatePandaImage();
        };

        const handleTouchEnd = () => {
            pandaClicker.classList.remove('pressed');
            updatePandaImage();
            if (energy > 0) {
                coins += 1; // Увеличиваем количество монет на 1
                energy -= 1;
                document.getElementById('coin-count').textContent = coins;
                document.getElementById('energy-count').textContent = `${energy} / ${maxEnergy}`;
                saveProgress('coins', coins);
                saveProgress('energy', energy);
            } else {
                alert('Ваша энергия истощена. Попробуйте восстановить энергию.');
            }
        };

        // Обработка событий для мыши
        pandaClicker.addEventListener('mousedown', handleTouchStart);
        pandaClicker.addEventListener('mouseup', handleTouchEnd);
        pandaClicker.addEventListener('mouseleave', handleTouchEnd); // Если мышь уходит за пределы кнопки

        // Обработка событий для сенсорных устройств
        pandaClicker.addEventListener('touchstart', handleTouchStart);
        pandaClicker.addEventListener('touchend', handleTouchEnd);

        // Восстановление энергии с таймером
        const energyRecoveryRate = 2 * 1000; // 1 энергия каждые 2 секунды
        setInterval(() => {
            if (energy < maxEnergy) {
                energy += 1; // Восстанавливаем 1 единицу энергии
                document.getElementById('energy-count').textContent = `${energy} / ${maxEnergy}`;
                saveProgress('energy', energy);
                updatePandaImage(); // Обновляем изображение панды при восстановлении энергии
            }
        }, energyRecoveryRate);
    };

    // Проверка, что секции загрузились перед инициализацией кликера
    const checkSectionsLoaded = setInterval(() => {
        if (document.getElementById('header-section') && document.getElementById('footer-section')) {
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

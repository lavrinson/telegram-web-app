document.addEventListener('DOMContentLoaded', function() {
    const clickerImage = document.getElementById('clicker-image');
    const energyCountElement = document.getElementById('energy-count');
    const boostButton = document.querySelector('.boost-button'); // Кнопка Boost
    const boostStatus = document.getElementById('boost-status'); // Статусный значок на кнопке Boost
    const explosionContainer = document.getElementById('explosion-container'); // Контейнер взрыва
    const boostTimerElement = document.getElementById('boost-timer'); // Элемент таймера под кнопкой Boost

    let coinCount = parseInt(localStorage.getItem('coins')) || 0;
    let energyCount = parseInt(localStorage.getItem('energy')) || 100;
    const lastEnergyUpdate = localStorage.getItem('lastEnergyUpdate');
    const lastBoostTime = localStorage.getItem('lastBoostTime');
    const lastGameAttemptTime = localStorage.getItem('lastGameAttemptTime'); // Время последней попытки игры

    // Добавляем новый элемент индикатора к кнопке Boost
    const boostIndicator = document.createElement('div');
    boostIndicator.classList.add('boost-indicator');
    boostButton.appendChild(boostIndicator);

    function updateEnergy() {
        const now = new Date();
        const lastUpdateDate = new Date(lastEnergyUpdate);

        if (!lastEnergyUpdate || now.getDate() !== lastUpdateDate.getDate()) {
            energyCount = 100;
            localStorage.setItem('energy', energyCount);
            localStorage.setItem('lastEnergyUpdate', now.toISOString());
        }
    }

    if (energyCountElement) {
        energyCountElement.textContent = `${energyCount}/100`;
    }

    updateEnergy();

    function handleClick() {
        if (energyCount > 0) {
            coinCount++;
            energyCount--;

            localStorage.setItem('coins', coinCount);
            localStorage.setItem('energy', energyCount);

            if (energyCountElement) {
                energyCountElement.textContent = `${energyCount}/100`;
            }

            if (window.updateCoins) {
                window.updateCoins();
            }

            createExplosionEffect(); // Создаем эффект взрыва

        } else {
            alert('Not enough energy to click!');
        }
    }

    function createExplosionEffect() {
        // Удаляем старые эффекты взрыва
        explosionContainer.innerHTML = '';

        // Создаем эффект взрыва
        for (let i = 0; i < 20; i++) {
            const explosion = document.createElement('div');
            explosion.classList.add('explosion-effect');

            // Устанавливаем случайные позиции и анимации
            const tx = Math.random() * 200 - 100; // Параметры перемещения по оси X
            const ty = Math.random() * 200 - 100; // Параметры перемещения по оси Y
            explosion.style.setProperty('--tx', `${tx}px`);
            explosion.style.setProperty('--ty', `${ty}px`);
            explosion.style.top = '50%';
            explosion.style.left = '50%';
            explosion.style.transform = `translate(-50%, -50%)`;

            explosionContainer.appendChild(explosion);

            // Запускаем анимацию
            setTimeout(() => {
                explosion.style.opacity = 1;
                explosion.style.animation = 'explode 0.5s forwards';
            }, 10);
        }
    }

    if (clickerImage) {
        clickerImage.addEventListener('mousedown', () => {
            clickerImage.classList.add('clicked');
        });

        clickerImage.addEventListener('mouseup', () => {
            clickerImage.classList.remove('clicked');
        });

        clickerImage.addEventListener('touchstart', () => {
            clickerImage.classList.add('clicked');
        });

        clickerImage.addEventListener('touchend', () => {
            clickerImage.classList.remove('clicked');
        });

        clickerImage.addEventListener('click', handleClick);
    } else {
        console.error('Clicker image not found!');
    }

    // Функция проверки доступности кнопки Boost после игры
    function canUseBoostAfterGame() {
        const now = new Date();
        const lastBoostDate = new Date(lastBoostTime);

        // Разница во времени в минутах
        const differenceInMinutes = Math.floor((now - lastBoostDate) / (1000 * 60));

        // Период ограничения в минутах (3 минуты для теста)
        const boostCooldownMinutes = 3;

        // Проверка, прошел ли период ограничения
        return !lastBoostTime || differenceInMinutes >= boostCooldownMinutes;
    }

    // Функция проверки, может ли игрок начать новую попытку игры
    function canAttemptGameAgain() {
        const now = new Date();
        const lastAttemptDate = new Date(lastGameAttemptTime);

        // Разница во времени в минутах
        const differenceInMinutes = Math.floor((now - lastAttemptDate) / (1000 * 60));

        // Период ограничения в минутах (1 минута для повторной попытки)
        const attemptCooldownMinutes = 1;

        return !lastGameAttemptTime || differenceInMinutes >= attemptCooldownMinutes;
    }

    // Обновляем индикатор на кнопке Boost
    function updateBoostIndicator() {
        if (!canAttemptGameAgain()) {
            boostIndicator.className = 'boost-indicator clock'; // Устанавливаем символ часов
            boostIndicator.textContent = '⏰';
        } else if (!canUseBoostAfterGame()) {
            boostIndicator.className = 'boost-indicator green-check'; // Устанавливаем зеленую галочку
            boostIndicator.textContent = '✔';
        } else {
            boostIndicator.className = 'boost-indicator exclamation'; // Устанавливаем мигающий восклицательный знак
            boostIndicator.textContent = '!';
        }
    }

    // Функция для обновления таймера под кнопкой Boost
    function updateBoostTimer() {
        const now = new Date();
        let timeLeftText = '';

        if (!canAttemptGameAgain()) {
            const lastAttemptDate = new Date(lastGameAttemptTime);
            const differenceInSeconds = Math.floor((now - lastAttemptDate) / 1000);
            const timeLeft = 60 - differenceInSeconds; // Время до следующей попытки (1 минута)
            timeLeftText = `Next attempt in: ${timeLeft}s`;
        } else if (!canUseBoostAfterGame()) {
            const lastBoostDate = new Date(lastBoostTime);
            const differenceInSeconds = Math.floor((now - lastBoostDate) / 1000);
            const timeLeft = 180 - differenceInSeconds; // Время до следующего использования Boost (3 минуты)
            timeLeftText = `Boost available in: ${timeLeft}s`;
        }

        boostTimerElement.textContent = timeLeftText;
    }

    // Обновляем таймер каждую секунду
    setInterval(updateBoostTimer, 1000);

    // Инициализация индикатора при загрузке
    updateBoostIndicator();
    updateBoostTimer(); // Инициализация таймера

    // Обработчик для кнопки Boost
    if (boostButton) {
        boostButton.addEventListener('click', (event) => {
            if (canAttemptGameAgain()) {
                // Обновляем время последней попытки игры
                localStorage.setItem('lastGameAttemptTime', new Date().toISOString());

                if (energyCount > 0) {
                    // Проверяем, можно ли использовать Boost для восстановления энергии
                    if (canUseBoostAfterGame()) {
                        // Обновляем последний раз использования Boost
                        localStorage.setItem('lastBoostTime', new Date().toISOString());

                        // Восстанавливаем энергию
                        energyCount = 100; // Восстанавливаем энергию до максимума
                        localStorage.setItem('energy', energyCount);

                        if (energyCountElement) {
                            energyCountElement.textContent = `${energyCount}/100`;
                        }

                        alert('Energy replenished! You can use Boost again in 3 minutes.');

                        // Удаляем значок на кнопке Boost
                        if (boostStatus) {
                            boostStatus.style.display = 'none';
                        }

                        window.location.href = 'puzzle.html'; // Перенаправляем на страницу с игрой
                    } else {
                        alert('Boost is not ready yet.');
                        event.preventDefault(); // Предотвращаем переход, если недостаточно энергии
                    }
                } else {
                    alert('Not enough energy to use boost!');
                    event.preventDefault(); // Предотвращаем переход, если попытка игры еще не готова
                }
            } else {
                alert('You need to wait 1 minute before trying the game again.');
                event.preventDefault(); // Предотвращаем переход, если попытка игры еще не готова
            }

            updateBoostIndicator(); // Обновляем индикатор после нажатия
        });
    } else {
        console.error('Boost button not found!');
    }
});

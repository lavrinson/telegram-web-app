document.addEventListener('DOMContentLoaded', function() {
    const clickerImage = document.getElementById('clicker-image');
    const energyCountElement = document.getElementById('energy-count');

    let coinCount = parseInt(localStorage.getItem('coins')) || 0;
    let energyCount = parseInt(localStorage.getItem('energy')) || 100;
    const lastEnergyUpdate = localStorage.getItem('lastEnergyUpdate');

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
        energyCountElement.textContent = `${energyCount}`;
    }

    updateEnergy();

    function handleClick() {
        if (energyCount > 0) {
            coinCount++;
            energyCount--;

            // Сохраняем данные и обновляем на текущей странице
            localStorage.setItem('coins', coinCount);
            localStorage.setItem('energy', energyCount);

            // Обновляем отображение энергии
            if (energyCountElement) {
                energyCountElement.textContent = `${energyCount}`;
            }

            // Обновляем отображение монет в блоке пользователя
            if (window.updateCoins) {
                window.updateCoins();
            }

        } else {
            alert('Not enough energy to click!');
        }
    }

    if (clickerImage) {
        // Добавляем класс зума при нажатии на кнопку
        clickerImage.addEventListener('mousedown', () => {
            clickerImage.classList.add('clicked');
        });

        // Убираем класс зума при отпускании кнопки
        clickerImage.addEventListener('mouseup', () => {
            clickerImage.classList.remove('clicked');
        });

        // Поддержка касания для мобильных устройств
        clickerImage.addEventListener('touchstart', () => {
            clickerImage.classList.add('clicked');
        });

        clickerImage.addEventListener('touchend', () => {
            clickerImage.classList.remove('clicked');
        });

        // Обработка клика
        clickerImage.addEventListener('click', handleClick);
    } else {
        console.error('Clicker image not found!');
    }
});

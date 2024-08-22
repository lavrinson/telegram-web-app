document.addEventListener('DOMContentLoaded', function() {
    const clickerImage = document.getElementById('clicker-image');
    const energyCountElement = document.getElementById('energy-count');
    const boostButton = document.querySelector('.boost-button'); // Кнопка Boost
    const boostStatus = document.getElementById('boost-status'); // Статусный значок на кнопке Boost

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

        } else {
            alert('Not enough energy to click!');
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

    // Обработчик для кнопки Boost
    if (boostButton) {
        boostButton.addEventListener('click', (event) => {
            // Проверяем, есть ли достаточно энергии для перехода
            if (energyCount > 0) {
                // Удаляем значок на кнопке Boost
                if (boostStatus) {
                    boostStatus.style.display = 'none';
                }

                window.location.href = 'puzzle.html'; // Перенаправляем на страницу с игрой
            } else {
                alert('Not enough energy to use boost!');
                event.preventDefault(); // Предотвращаем переход
            }
        });
    } else {
        console.error('Boost button not found!');
    }
});

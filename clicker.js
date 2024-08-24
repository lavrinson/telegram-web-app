document.addEventListener('DOMContentLoaded', function() {
    const clickerImage = document.getElementById('clicker-image');
    const energyCountElement = document.getElementById('energy-count');

    let coinCount = parseInt(localStorage.getItem('coins')) || 0;
    let energyCount = parseInt(localStorage.getItem('energy')) || 100;

    if (energyCountElement) {
        energyCountElement.textContent = `${energyCount}/100`;
    }

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
        clickerImage.addEventListener('click', handleClick);
    } else {
        console.error('Clicker image not found!');
    }
});

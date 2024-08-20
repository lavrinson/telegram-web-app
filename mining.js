document.addEventListener('DOMContentLoaded', function() {
    const miningButton = document.getElementById('mining-button');
    const progressBar = document.getElementById('progress-bar');
    const minedCoinsDisplay = document.getElementById('mined-coins-display');

    let miningInterval;
    let timeLeft = 60; // 1 минута для теста
    let maxEnergy = 100; // Максимальная энергия (и максимальное количество монет)
    let minedCoins = 0;

    function formatTime(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = seconds % 60;
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    function updateTimer() {
        minedCoins = maxEnergy - (timeLeft * maxEnergy) / 60; // Обновляем количество намайненных монет
        progressBar.style.width = `${(minedCoins / maxEnergy) * 100}%`; // Обновляем ширину прогресс-бара
        minedCoinsDisplay.textContent = `${Math.floor(minedCoins)}/${maxEnergy}`; // Обновляем отображение намайненных монет

        const formattedTime = formatTime(timeLeft);
        miningButton.textContent = `Mining... ${formattedTime}`; // Обновляем текст кнопки с таймером

        timeLeft--;

        if (timeLeft < 0) {
            clearInterval(miningInterval);
            miningButton.textContent = `Farming complete! ${minedCoins.toFixed(2)} coins ready to claim.`; // Сообщение при завершении майнинга
            miningButton.disabled = false;
            miningButton.dataset.stage = 'claim';
        }
    }

    miningButton.addEventListener('click', function() {
        if (miningButton.dataset.stage === 'start') {
            // Начало майнинга
            timeLeft = 60; // 1 минута для теста
            minedCoins = 0;
            miningButton.textContent = `Mining... ${formatTime(timeLeft)}`;
            miningButton.disabled = true;
            miningButton.dataset.stage = 'mining';

            miningInterval = setInterval(updateTimer, 1000);
        } else if (miningButton.dataset.stage === 'claim') {
            // Завершение майнинга и добавление монет
            let currentCoins = parseInt(localStorage.getItem('coins')) || 0;
            localStorage.setItem('coins', currentCoins + Math.floor(minedCoins));
            window.updateCoins(); // Обновление отображения монет
            alert(`${Math.floor(minedCoins)} coins added to your account!`);
            miningButton.textContent = 'Start Mining';
            miningButton.dataset.stage = 'start';
            progressBar.style.width = '0%'; // Сброс прогресс-бара
            minedCoinsDisplay.textContent = `0/${maxEnergy}`; // Сброс отображения монет
        }
    });

    // Инициализация
    miningButton.textContent = 'Start Mining';
    miningButton.dataset.stage = 'start';
});

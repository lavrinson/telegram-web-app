document.addEventListener('DOMContentLoaded', function() {
    const miningButton = document.getElementById('mining-button');
    const progressBar = document.getElementById('progress-bar');
    const minedCoinsDisplay = document.getElementById('mined-coins-display');

    let miningInterval;
    let timeLeft = 60; // Время для майнинга (в секундах)
    const maxEnergy = 100; // Максимальное количество монет
    let minedCoins = 0;

    // Форматирование времени в ЧЧ:ММ:СС
    function formatTime(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = seconds % 60;
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    // Обновление состояния таймера и прогресс-бара
    function updateTimer() {
        minedCoins = maxEnergy - (timeLeft * maxEnergy) / 60; // Расчет намайненных монет
        progressBar.style.width = `${(minedCoins / maxEnergy) * 100}%`; // Обновление ширины прогресс-бара
        minedCoinsDisplay.textContent = `${Math.floor(minedCoins)}/${maxEnergy}`; // Обновление отображения монет

        const formattedTime = formatTime(timeLeft);
        miningButton.textContent = `Mining... ${formattedTime}`; // Обновление текста кнопки с таймером

        timeLeft--;

        if (timeLeft < 0) {
            clearInterval(miningInterval);
            miningButton.textContent = `Farming complete! ${minedCoins.toFixed(2)} claim coins.`; // Сообщение при завершении майнинга
            miningButton.disabled = false;
            miningButton.dataset.stage = 'claim';
        }
    }

    // Обработчик клика по кнопке майнинга
    miningButton.addEventListener('click', function() {
        if (miningButton.dataset.stage === 'start') {
            // Начало майнинга
            timeLeft = 60; // Время майнинга (в секундах)
            minedCoins = 0;
            miningButton.textContent = `Mining... ${formatTime(timeLeft)}`;
            miningButton.disabled = true;
            miningButton.dataset.stage = 'mining';

            miningInterval = setInterval(updateTimer, 1000);
        } else if (miningButton.dataset.stage === 'claim') {
            // Завершение майнинга и добавление монет
            let currentCoins = parseInt(localStorage.getItem('coins')) || 0;
            localStorage.setItem('coins', currentCoins + Math.floor(minedCoins));
            if (typeof window.updateCoins === 'function') {
                window.updateCoins(); // Обновление отображения монет (если функция существует)
            }
            alert(`${Math.floor(minedCoins)} coins added to your account!`);
            miningButton.textContent = 'Start Mining';
            miningButton.dataset.stage = 'start';
            progressBar.style.width = '0%'; // Сброс прогресс-бара
            minedCoinsDisplay.textContent = `0/${maxEnergy}`; // Сброс отображения монет
        }
    });

    // Инициализация кнопки
    miningButton.textContent = 'Start Mining';
    miningButton.dataset.stage = 'start';
});

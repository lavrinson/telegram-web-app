document.addEventListener('DOMContentLoaded', function() {
    function loadUserInfo() {
        return fetch('user-info.html')
            .then(response => response.text())
            .then(html => {
                // Вставляем блок пользователя перед футером
                document.querySelector('body').insertAdjacentHTML('afterbegin', html);
                // Обновляем количество монет после загрузки блока
                updateCoins();
                initTelegramWebApp(); // Инициализация Telegram WebApp API
            })
            .catch(error => console.error('Error loading user info:', error));
    }

    function updateCoins() {
        const coinCountElement = document.getElementById('coin-count');
        const savedCoins = parseInt(localStorage.getItem('coins')) || 0;
        if (coinCountElement) {
            coinCountElement.textContent = `${savedCoins}`; // Убрано слово "Coins:"
        }
    }

    function initTelegramWebApp() {
        // Проверяем наличие объекта Telegram и его свойств
        if (typeof Telegram !== 'undefined' && Telegram.WebApp) {
            console.log('Telegram WebApp API is connected and available.');
            console.log('Platform:', Telegram.WebApp.platform);
            console.log('Version:', Telegram.WebApp.version);
            console.log('Theme params:', Telegram.WebApp.themeParams);

            // Устанавливаем цвет верхнего бара
            Telegram.WebApp.setHeaderColor("bg_color", "#1e90ff"); // Пример установки синего цвета

            // Устанавливаем значение для главной кнопки и показываем её
            Telegram.WebApp.mainButton.setText("Получить монеты");
            Telegram.WebApp.mainButton.setColor("#0088cc");
            Telegram.WebApp.mainButton.setTextColor("#ffffff");
            Telegram.WebApp.mainButton.show();

            // Добавляем обработчик клика для главной кнопки
            Telegram.WebApp.mainButton.onClick(function() {
                let coinCountElement = document.getElementById('coin-count');
                let currentCount = parseInt(coinCountElement.textContent);
                let newCount = currentCount + 10; // Добавляем 10 монет при каждом клике
                coinCountElement.textContent = newCount;
                localStorage.setItem('coins', newCount); // Сохраняем новое количество монет
                console.log('Coins added. New count:', newCount);
            });
        } else {
            console.log('Telegram WebApp API is NOT available.');
        }
    }

    loadUserInfo();
    window.updateCoins = updateCoins; // Делаем функцию доступной глобально для вызова из других скриптов
});

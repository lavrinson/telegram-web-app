document.addEventListener('DOMContentLoaded', function() {
    function loadUserInfo() {
        return fetch('user-info.html')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }
                return response.text();
            })
            .then(html => {
                document.querySelector('body').insertAdjacentHTML('afterbegin', html);
                updateUserInfo();  // Обновляем информацию о пользователе, включая username
                updateCoins();
            })
            .catch(error => console.error('Error loading user info:', error));
    }

    function updateCoins() {
        const coinCountElement = document.getElementById('coin-count');
        const savedCoins = parseInt(localStorage.getItem('coins')) || 0;
        if (coinCountElement) {
            coinCountElement.textContent = `${savedCoins}`;
        } else {
            console.error('Coin count element not found!');
        }
    }

    function updateUserInfo() {
        if (typeof Telegram !== 'undefined' && Telegram.WebApp && Telegram.WebApp.initDataUnsafe) {
            let user = Telegram.WebApp.initDataUnsafe.user;
            if (user && user.username) {
                document.querySelector('.user-name').textContent = user.username;
            } else if (user && user.first_name) {
                document.querySelector('.user-name').textContent = user.first_name;
            } else {
                document.querySelector('.user-name').textContent = 'No Name';
            }
        } else {
            console.log('Telegram WebApp API is not available or user is not authenticated.');
        }
    }

    loadUserInfo();
    window.updateCoins = updateCoins;
});

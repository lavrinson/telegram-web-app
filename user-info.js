document.addEventListener('DOMContentLoaded', function() {
    function loadUserInfo() {
        return fetch('user-info.html')
            .then(response => response.text())
            .then(html => {
                // Вставляем блок пользователя перед футером
                document.querySelector('body').insertAdjacentHTML('afterbegin', html);
                // Обновляем количество монет после загрузки блока
                updateCoins();
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


    loadUserInfo();
    window.updateCoins = updateCoins; // Делаем функцию доступной глобально для вызова из других скриптов
});

document.addEventListener('DOMContentLoaded', function() {
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

    updateUserInfo(); // Обновляем информацию о пользователе при загрузке страницы
});

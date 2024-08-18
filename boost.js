document.addEventListener('DOMContentLoaded', function () {
    const boostButton = document.getElementById('boost-button');
    const boostModal = document.getElementById('boost-modal');
    const closeButton = document.querySelector('.close-button');
    const confirmBoostButton = document.getElementById('confirm-boost');

    // Открытие модального окна
    boostButton.addEventListener('click', function () {
        boostModal.style.display = 'flex';
    });

    // Закрытие модального окна
    closeButton.addEventListener('click', function () {
        boostModal.style.display = 'none';
    });

    // Подтверждение активации буста
    confirmBoostButton.addEventListener('click', function () {
        alert('Энергия восстановлена!');
        boostModal.style.display = 'none';
    });

    // Закрытие модального окна при клике вне его
    window.addEventListener('click', function (event) {
        if (event.target === boostModal) {
            boostModal.style.display = 'none';
        }
    });
});

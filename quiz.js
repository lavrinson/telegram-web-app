document.addEventListener('DOMContentLoaded', function() {
    const quizCards = document.querySelectorAll('.quiz-card');
    let selectedCard = null;

    quizCards.forEach(card => {
        card.addEventListener('click', function() {
            if (selectedCard) {
                selectedCard.classList.remove('selected');
            }
            card.classList.add('selected');
            selectedCard = card;
        });
    });

    const voteButton = document.querySelector('.vote-button');
    voteButton.addEventListener('click', function() {
        if (selectedCard) {
            alert(`Вы проголосовали за: ${selectedCard.querySelector('.quiz-card-title').textContent}`);
            // Здесь можно добавить логику для отправки выбранного варианта на сервер или обработки результата
        } else {
            alert('Пожалуйста, выберите вариант для голосования.');
        }
    });
});
document.addEventListener('DOMContentLoaded', function() {
    const quizCards = document.querySelectorAll('.quiz-card');

    quizCards.forEach(card => {
        card.addEventListener('click', function() {
            // Удаляем класс active со всех карточек
            quizCards.forEach(card => card.classList.remove('active'));

            // Добавляем класс active к текущей карточке
            this.classList.add('active');
        });
    });
});
document.addEventListener('DOMContentLoaded', function() {
    const quizCards = document.querySelectorAll('.quiz-card');
    let selectedCard = null;

    quizCards.forEach(card => {
        card.addEventListener('click', function() {
            // Удаляем класс active со всех карточек
            quizCards.forEach(card => card.classList.remove('active'));

            // Добавляем класс active к текущей карточке
            this.classList.add('active');
            selectedCard = card;
        });
    });

    const voteButton = document.querySelector('.vote-button');
    voteButton.addEventListener('click', function() {
        if (selectedCard) {
            alert(`Вы проголосовали за: ${selectedCard.querySelector('.quiz-card-title').textContent}`);
            // Здесь можно добавить логику для отправки выбранного варианта на сервер или обработки результата
        } else {
            alert('Пожалуйста, выберите вариант для голосования.');
        }
    });

    // Логика изменения количества монет
    const coinAmountInput = document.getElementById('coin-amount');
    const decreaseButton = document.getElementById('decrease-button');
    const increaseButton = document.getElementById('increase-button');
    const displayCoinAmount = document.getElementById('display-coin-amount');

    let coinAmount = parseInt(coinAmountInput.value);

    decreaseButton.addEventListener('click', () => {
        if (coinAmount > 1) {
            coinAmount--;
            coinAmountInput.value = coinAmount;
            displayCoinAmount.textContent = coinAmount;
        }
    });

    increaseButton.addEventListener('click', () => {
        coinAmount++;
        coinAmountInput.value = coinAmount;
        displayCoinAmount.textContent = coinAmount;
    });

    coinAmountInput.addEventListener('input', () => {
        coinAmount = parseInt(coinAmountInput.value) || 1;
        if (coinAmount < 1) coinAmount = 1; // Минимальное значение 1
        displayCoinAmount.textContent = coinAmount;
    });
});

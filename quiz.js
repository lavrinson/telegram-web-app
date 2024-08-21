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

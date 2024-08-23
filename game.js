document.addEventListener('DOMContentLoaded', function() {
    const cards = document.querySelectorAll('.card');

    cards.forEach(card => {
        card.addEventListener('click', function() {
            // Удаляем класс active со всех карточек
            cards.forEach(c => c.classList.remove('active'));

            // Добавляем класс active к текущей карточке
            this.classList.add('active');
        });
    });
});

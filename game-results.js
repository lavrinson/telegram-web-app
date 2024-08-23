document.addEventListener('DOMContentLoaded', function() {
    const resultTitle = document.getElementById('result-title');
    const resultDate = document.getElementById('result-date');
    const winnerName = document.getElementById('winner-name');
    const winnerBones = document.getElementById('winner-bones');
    const winnerSubtext = document.getElementById('winner-subtext');
    const winnerImage = document.getElementById('winner-image');

    const firstPlaceCard = document.getElementById('first-place-card');
    const firstPlaceVotes = document.getElementById('first-place-votes');
    const secondPlaceCard = document.getElementById('second-place-card');
    const secondPlaceVotes = document.getElementById('second-place-votes');
    const thirdPlaceCard = document.getElementById('third-place-card');
    const thirdPlaceVotes = document.getElementById('third-place-votes');

    // Получение данных из localStorage
    const winner = localStorage.getItem('winner');
    const winnerVotes = localStorage.getItem('winnerVotes');
    const results = JSON.parse(localStorage.getItem('results'));

    // Обновление страницы результатами
    resultTitle.textContent = winnerVotes >= results[0].votes ? 'Победа!' : 'Потрачено...';
    resultDate.textContent = new Date().toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' });

    winnerName.textContent = results[0].name;
    winnerBones.textContent = `${results[0].votes} BONES · ${results[0].votes}%`;
    winnerSubtext.textContent = 'Прием, как слышно?';
    winnerImage.src = results[0].image || 'assets/images/card1.webp';

    firstPlaceCard.textContent = results[0].name;
    firstPlaceVotes.textContent = `${results[0].votes}% голосов`;

    secondPlaceCard.textContent = results[1].name;
    secondPlaceVotes.textContent = `${results[1].votes}% голосов · Победил · Твой выбор`;

    thirdPlaceCard.textContent = results[2].name;
    thirdPlaceVotes.textContent = `${results[2].votes}% голосов`;
});
// Получаем ссылку на кнопку
const rewardButton = document.getElementById('reward-button');

// Добавляем обработчик события клика
rewardButton.addEventListener('click', () => {
    window.location.href = 'game.html'; // Переход на страницу game.html
});

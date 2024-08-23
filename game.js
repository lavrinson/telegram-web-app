document.addEventListener('DOMContentLoaded', function() {
    const cards = document.querySelectorAll('.card');
    const voteButton = document.querySelector('.vote-button button');
    const bronzeButton = document.getElementById('bronze-button');
    const silverButton = document.getElementById('silver-button');
    const goldButton = document.getElementById('gold-button');
    const rewardButtons = document.querySelectorAll('.reward-button');
    const timerElement = document.getElementById('timer');

    let activeIndex = 1;
    let timer = 60; // Таймер на 1 минуту

    function updateCards() {
        cards.forEach((card, index) => {
            card.classList.remove('active');
            if (index === activeIndex) {
                card.classList.add('active');
            }
        });
    }

    cards.forEach((card, index) => {
        card.addEventListener('click', function() {
            if (!voteButton.disabled) {  // Блокировка изменения карточек после голосования
                activeIndex = index;
                updateCards();
            }
        });
    });

    updateCards();

    // Установка начального текста для кнопки
    voteButton.textContent = 'Проголосовать 100 PANDAS';

    function clearSelection() {
        rewardButtons.forEach(button => {
            button.classList.remove('selected');
        });
    }

    // По умолчанию выбираем бронзовый сундук
    function selectBronzeBox() {
        voteButton.textContent = 'Проголосовать 100 PANDAS';
        clearSelection();
        bronzeButton.classList.add('selected');
    }

    bronzeButton.addEventListener('click', function() {
        if (!voteButton.disabled) {  // Блокировка изменения сундука после голосования
            voteButton.textContent = 'Проголосовать 100 PANDAS';
            clearSelection();
            bronzeButton.classList.add('selected');
        }
    });

    silverButton.addEventListener('click', function() {
        if (!voteButton.disabled) {  // Блокировка изменения сундука после голосования
            voteButton.textContent = 'Проголосовать 500 PANDAS';
            clearSelection();
            silverButton.classList.add('selected');
        }
    });

    goldButton.addEventListener('click', function() {
        if (!voteButton.disabled) {  // Блокировка изменения сундука после голосования
            voteButton.textContent = 'Проголосовать 1500 PANDAS';
            clearSelection();
            goldButton.classList.add('selected');
        }
    });

    // Выбираем бронзовый сундук по умолчанию при загрузке страницы
    selectBronzeBox();

    // Обработчик события на кнопку голосования
    voteButton.addEventListener('click', function() {
        voteButton.textContent = 'Выбор сделан! 🎉';
        voteButton.style.backgroundColor = '#28a745'; // Зеленый цвет кнопки
        voteButton.style.boxShadow = '0 4px #1e7e34'; // Тень в зеленом цвете
        voteButton.style.cursor = 'default'; // Убираем возможность повторного нажатия
        voteButton.disabled = true; // Блокируем кнопку после голосования

        // Блокируем выбор карточек и сундуков после голосования
        cards.forEach(card => {
            card.style.pointerEvents = 'none'; // Блокировка взаимодействия с карточками
        });

        rewardButtons.forEach(button => {
            button.style.pointerEvents = 'none'; // Блокировка взаимодействия с сундуками
        });
    });

    // Таймер обратного отсчета
    const countdown = setInterval(() => {
        if (timer <= 0) {
            clearInterval(countdown);
            redirectToResults();
        } else {
            timer--;
            const minutes = Math.floor(timer / 60);
            const seconds = timer % 60;
            timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
    }, 1000);

    // Функция для перехода на страницу с результатами
    function redirectToResults() {
        // Логика определения победителя
        const votes = [
            { name: 'СИЛУ', votes: parseFloat(bronzeButton.textContent) || 0 },
            { name: 'МУДРОСТЬ', votes: parseFloat(silverButton.textContent) || 0 },
            { name: 'БОГАТСТВО', votes: parseFloat(goldButton.textContent) || 0 }
        ];

        votes.sort((a, b) => b.votes - a.votes);

        // Сохранение результатов в localStorage для передачи на страницу результатов
        localStorage.setItem('winner', votes[0].name);
        localStorage.setItem('winnerVotes', votes[0].votes);
        localStorage.setItem('results', JSON.stringify(votes));

        // Переход на страницу результатов
        window.location.href = 'game-results.html';
    }
});

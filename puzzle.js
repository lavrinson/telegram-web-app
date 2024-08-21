document.addEventListener('DOMContentLoaded', function() {
    const puzzleBoard = document.getElementById('puzzle-board');
    const targetNumberElement = document.getElementById('target-number');
    const timerElement = document.getElementById('timer');
    const messageElement = document.getElementById('message');

    const boardSize = 6; // 6x6 board
    const combinationLength = 5;
    const cells = [];
    let combination = generateCombination();
    let selectedCells = [];
    let timer;
    let timeLeft = 60; // 60 seconds
    let isSelecting = false;
    let startIndex = null;

    function generateCombination() {
        const direction = Math.floor(Math.random() * 4); // 0 = horizontal, 1 = vertical, 2 = diagonal down-right, 3 = diagonal down-left
        const startRow = Math.floor(Math.random() * boardSize);
        const startCol = Math.floor(Math.random() * boardSize);

        let comb = [];
        let currRow = startRow;
        let currCol = startCol;

        for (let i = 0; i < combinationLength; i++) {
            if (currRow < 0 || currRow >= boardSize || currCol < 0 || currCol >= boardSize) {
                return generateCombination(); // Regenerate if out of bounds
            }
            comb.push(currRow * boardSize + currCol);

            switch (direction) {
                case 0: currCol++; break; // Horizontal
                case 1: currRow++; break; // Vertical
                case 2: currRow++; currCol++; break; // Diagonal down-right
                case 3: currRow++; currCol--; break; // Diagonal down-left
            }
        }
        return comb;
    }

    function createBoard() {
        for (let i = 0; i < boardSize * boardSize; i++) {
            let cell = document.createElement('div');
            cell.classList.add('puzzle-cell');
            cell.textContent = Math.floor(Math.random() * 10); // Random digit
            cell.dataset.index = i;
            cell.dataset.value = cell.textContent; // Store the digit value
            applyCellStyle(cell); // Apply styles based on the digit

            cell.addEventListener('mousedown', (e) => handleCellStart(e, cell));
            cell.addEventListener('mouseenter', (e) => handleCellHover(e, cell));
            cell.addEventListener('mouseup', (e) => handleCellEnd(e));
            cell.addEventListener('touchstart', (e) => handleTouchStart(e, cell));
            cell.addEventListener('touchmove', (e) => handleTouchMove(e));
            cell.addEventListener('touchend', (e) => handleTouchEnd(e));

            puzzleBoard.appendChild(cell);
            cells.push(cell);
        }
        placeCombination();
    }

    function applyCellStyle(cell) {
        const value = cell.dataset.value;
        const colorMapping = {
            '0': { bg: '#000000', color: '#000080' },
            '1': { bg: '#000000', color: '#8b4513' },
            '2': { bg: '#000000', color: '#4b0082' },
            '3': { bg: '#000000', color: '#800080' },
            '4': { bg: '#000000', color: '#ff4500' },
            '5': { bg: '#000000', color: '#2e8b57' },
            '6': { bg: '#000000', color: '#ff6347' },
            '7': { bg: '#000000', color: '#4682b4' },
            '8': { bg: '#000000', color: '#d2691e' },
            '9': { bg: '#000000', color: '#ff1493' }
        };

        const style = colorMapping[value] || { bg: '#000000', color: '#ffffff' };
        cell.style.backgroundColor = style.bg;
        cell.style.color = style.color;
    }

    function placeCombination() {
        let digits = generateTargetDigits();
        targetNumberElement.textContent = `Find the combination: ${digits.join('')}`;

        for (let i = 0; i < combination.length; i++) {
            const index = combination[i];
            const cell = cells[index];
            cell.textContent = digits[i]; // Set the correct digit in the cell
            cell.dataset.combination = 'true'; // Mark cell as part of the combination
        }
    }

    function generateTargetDigits() {
        return Array.from({ length: combinationLength }, () => Math.floor(Math.random() * 10));
    }

    function handleCellStart(e, cell) {
        e.preventDefault();
        if (cell.dataset.combination === 'true') {
            isSelecting = true;
            startIndex = parseInt(cell.dataset.index, 10);
            selectedCells = [startIndex];
            cell.classList.add('selected');
        }
    }

    function handleCellHover(e, cell) {
        e.preventDefault();
        if (isSelecting && cell.dataset.combination === 'true') {
            const index = parseInt(cell.dataset.index, 10);
            if (!selectedCells.includes(index)) {
                selectedCells.push(index);
                cell.classList.add('selected');
            }
        }
    }

    function handleCellEnd(e) {
        e.preventDefault();
        if (isSelecting) {
            checkCombination();
            resetSelection();
        }
    }

    function handleTouchStart(e, cell) {
        e.preventDefault();
        if (cell.dataset.combination === 'true') {
            isSelecting = true;
            startIndex = parseInt(cell.dataset.index, 10);
            selectedCells = [startIndex];
            cell.classList.add('selected');
        }
    }

    function handleTouchMove(e) {
        e.preventDefault();
        if (isSelecting) {
            const touch = e.touches[0];
            const cell = document.elementFromPoint(touch.clientX, touch.clientY);
            if (cell && cell.classList.contains('puzzle-cell') && cell.dataset.combination === 'true') {
                const index = parseInt(cell.dataset.index, 10);
                if (!selectedCells.includes(index)) {
                    selectedCells.push(index);
                    cell.classList.add('selected');
                }
            }
        }
    }

    function handleTouchEnd(e) {
        e.preventDefault();
        if (isSelecting) {
            checkCombination();
            resetSelection();
        }
    }

    function checkCombination() {
        const selectedIndices = new Set(selectedCells.map(index => parseInt(index, 10)));
        const correctIndices = new Set(combination.map(index => parseInt(index, 10)));

        if (selectedIndices.size === combinationLength &&
            [...selectedIndices].sort().join(',') === [...correctIndices].sort().join(',')) {
            triggerConfetti();
            setTimeout(() => {
                localStorage.setItem('energy', 100);
                window.location.href = 'index.html';
            }, 3000); // Wait for confetti animation (3 seconds)
        } else {
            messageElement.textContent = 'Incorrect combination. Try again!';
        }
    }

    function resetSelection() {
        selectedCells.forEach(index => {
            cells[index].classList.remove('selected');
        });
        selectedCells = [];
        isSelecting = false;
    }

    function startTimer() {
        timer = setInterval(() => {
            timeLeft--;
            updateTimerDisplay();

            if (timeLeft <= 0) {
                clearInterval(timer);
                messageElement.textContent = 'Time is up! Try again.';
                disableBoard();
            }
        }, 1000);
    }

    function updateTimerDisplay() {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        timerElement.textContent = `Time Left: ${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

        // Обновляем градиент в зависимости от времени
        const percent = timeLeft / 60;
        timerElement.style.background = `linear-gradient(to right, #00ff00 ${percent * 100}%, #ff0000 ${percent * 100}%)`;
        timerElement.style.webkitBackgroundClip = 'text'; // Для вебкита
        timerElement.style.webkitTextFillColor = 'transparent'; // Для вебкита
        timerElement.style.fontWeight = 'bold';
    }

    function disableBoard() {
        cells.forEach(cell => {
            cell.removeEventListener('mousedown', handleCellStart);
            cell.removeEventListener('mouseenter', handleCellHover);
            cell.removeEventListener('mouseup', handleCellEnd);
            cell.removeEventListener('touchstart', handleTouchStart);
            cell.removeEventListener('touchmove', handleTouchMove);
            cell.removeEventListener('touchend', handleTouchEnd);
        });
    }

    function triggerConfetti() {
        const confettiContainer = document.createElement('div');
        confettiContainer.classList.add('confetti');
        document.body.appendChild(confettiContainer);

        const emojis = ['🎉', '🎊', '🎈', '🎆', '✨'];
        for (let i = 0; i < 100; i++) {
            const confettiItem = document.createElement('div');
            confettiItem.classList.add('confetti-item');
            confettiItem.textContent = emojis[Math.floor(Math.random() * emojis.length)];
            confettiItem.style.setProperty('--x', Math.random() * 2 - 1); // Random horizontal direction
            confettiItem.style.setProperty('--y', Math.random() * 2 - 1); // Random vertical direction
            confettiItem.style.fontSize = `${Math.random() * 20 + 10}px`;
            confettiItem.style.left = `${Math.random() * 100}vw`;
            confettiItem.style.top = `${Math.random() * 100}vh`;
            confettiItem.style.animationDuration = `${Math.random() * 2 + 2}s`;
            confettiItem.style.opacity = Math.random();
            confettiContainer.appendChild(confettiItem);
        }

        // Удаляем контейнер с конфетти после завершения анимации
        setTimeout(() => {
            document.body.removeChild(confettiContainer);
        }, 5000); // Длительность анимации + небольшой запас времени
    }

    createBoard();
    startTimer();
});

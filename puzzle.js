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

            if (direction === 0) currCol++; // Horizontal
            else if (direction === 1) currRow++; // Vertical
            else if (direction === 2) { currRow++; currCol++; } // Diagonal down-right
            else if (direction === 3) { currRow++; currCol--; } // Diagonal down-left
        }
        return comb;
    }

    function createBoard() {
        for (let i = 0; i < boardSize * boardSize; i++) {
            let cell = document.createElement('div');
            cell.classList.add('puzzle-cell');
            cell.textContent = Math.floor(Math.random() * 10); // Random digit
            cell.dataset.index = i;
            cell.addEventListener('mousedown', (e) => handleCellStart(e, cell));
            cell.addEventListener('mouseenter', (e) => handleCellHover(e, cell));
            cell.addEventListener('mouseup', (e) => handleCellEnd(e));
            cell.addEventListener('touchstart', (e) => handleCellStart(e, cell));
            cell.addEventListener('touchmove', (e) => handleCellHover(e, cell));
            cell.addEventListener('touchend', (e) => handleCellEnd(e));
            puzzleBoard.appendChild(cell);
            cells.push(cell);
        }

        placeCombination();
    }

    function placeCombination() {
        let digits = generateTargetDigits();
        targetNumberElement.textContent = `Find the combination: ${digits.join('')}`;

        for (let i = 0; i < combination.length; i++) {
            const index = combination[i];
            const cell = cells[index];
            cell.textContent = digits[i]; // Set the correct digit in the cell
            cell.dataset.combination = true; // Mark cell as part of the combination
        }
    }

    function generateTargetDigits() {
        // Generate a random 5-digit number
        return Array.from({ length: combinationLength }, () => Math.floor(Math.random() * 10));
    }

    function handleCellStart(e, cell) {
        e.preventDefault(); // Prevent default behavior
        if (cell.dataset.combination) {
            isSelecting = true;
            startIndex = parseInt(cell.dataset.index);
            selectedCells = [startIndex];
            cell.classList.add('selected');
        }
    }

    function handleCellHover(e, cell) {
        e.preventDefault(); // Prevent default behavior
        if (isSelecting && cell.dataset.combination) {
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

    function checkCombination() {
        const selectedIndices = selectedCells.map(index => parseInt(index));
        const correctIndices = combination.map(index => parseInt(index));

        if (selectedIndices.length === combinationLength &&
            JSON.stringify(selectedIndices) === JSON.stringify(correctIndices)) {
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
    }

    function disableBoard() {
        cells.forEach(cell => {
            cell.removeEventListener('mousedown', (e) => handleCellStart(e, cell));
            cell.removeEventListener('mouseenter', (e) => handleCellHover(e, cell));
            cell.removeEventListener('mouseup', (e) => handleCellEnd(e));
            cell.removeEventListener('touchstart', (e) => handleCellStart(e, cell));
            cell.removeEventListener('touchmove', (e) => handleCellHover(e, cell));
            cell.removeEventListener('touchend', (e) => handleCellEnd(e));
        });
    }

    function triggerConfetti() {
        const confettiContainer = document.createElement('div');
        confettiContainer.classList.add('confetti');
        document.body.appendChild(confettiContainer);

        for (let i = 0; i < 100; i++) {
            const confettiItem = document.createElement('div');
            confettiItem.classList.add('confetti-item');
            confettiItem.style.backgroundColor = getRandomColor();
            confettiItem.style.left = `${Math.random() * 100}vw`;
            confettiItem.style.top = `${Math.random() * 100}vh`;
            confettiItem.style.width = `${Math.random() * 10 + 5}px`;
            confettiItem.style.height = confettiItem.style.width;
            confettiItem.style.animationDuration = `${Math.random() * 2 + 2}s`;
            confettiContainer.appendChild(confettiItem);
        }
    }

    function getRandomColor() {
        const colors = ['#ff0', '#0f0', '#f00', '#00f', '#f0f', '#0ff'];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    createBoard();
    startTimer();
});

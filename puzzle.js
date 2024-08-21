document.addEventListener('DOMContentLoaded', function() {
    const puzzleBoard = document.getElementById('puzzle-board');
    const targetNumberElement = document.getElementById('target-number');
    const timerElement = document.getElementById('timer');
    const messageElement = document.getElementById('message');

    const boardSize = 6; // 6x6 board
    const combinationLength = 5;
    const cells = [];
    let combinations = [];
    let currentCombinationIndex = 0;
    let selectedCells = [];
    let timer;
    let timeLeft = 60; // 60 seconds
    let isSelecting = false;
    let correctCombinationsCount = 0;

    const cooldownPeriod = 180000; // 3 minutes in milliseconds

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
            cell.addEventListener('touchstart', (e) => handleCellStart(e, cell));
            cell.addEventListener('touchmove', (e) => handleCellHover(e, cell));
            puzzleBoard.appendChild(cell);
            cells.push(cell);
        }

        if (canPlay()) {
            startNewGame();
        } else {
            messageElement.textContent = 'Please wait before starting a new game.';
            disableBoard();
        }
    }

    function canPlay() {
        const lastPlayed = localStorage.getItem('lastPlayed');
        if (!lastPlayed) return true;
        const now = Date.now();
        return (now - lastPlayed) > cooldownPeriod;
    }

    function startNewGame() {
        correctCombinationsCount = 0;
        combinations = Array.from({ length: 3 }, () => generateCombination());
        currentCombinationIndex = 0;
        timeLeft = 60;
        selectedCells = [];
        startTimer();
        placeCombination();
    }

    function placeCombination() {
        let combination = combinations[currentCombinationIndex];
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
            cell.classList.add('selected');
            selectedCells = [parseInt(cell.dataset.index)];
        }
    }

    function handleCellHover(e, cell) {
        e.preventDefault(); // Prevent default behavior
        if (isSelecting && cell.dataset.combination) {
            const index = parseInt(cell.dataset.index, 10);
            if (!selectedCells.includes(index)) {
                cell.classList.add('selected');
                selectedCells.push(index);
            }
        }
    }

    function handleCellEnd() {
        if (isSelecting) {
            checkCombination();
            isSelecting = false;
        }
    }

    function checkCombination() {
        const selectedIndices = selectedCells.map(index => parseInt(index));
        const correctIndices = combinations[currentCombinationIndex].map(index => parseInt(index));

        if (selectedIndices.length === combinationLength &&
            JSON.stringify(selectedIndices) === JSON.stringify(correctIndices)) {
            correctCombinationsCount++;
            if (correctCombinationsCount === 3) {
                localStorage.setItem('lastPlayed', Date.now());
                triggerConfetti();
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 3000); // Wait for confetti animation (3 seconds)
            } else {
                messageElement.textContent = `Correct! Solved ${correctCombinationsCount} of 3.`;
                resetSelection();
                currentCombinationIndex++;
                setTimeout(placeCombination, 1000); // Delay before showing next combination
            }
        } else {
            messageElement.textContent = 'Incorrect! Try again.';
            resetSelection();
        }
    }

    function resetSelection() {
        selectedCells.forEach(index => {
            cells[index].classList.remove('selected');
        });
        selectedCells = [];
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
            cell.removeEventListener('touchstart', (e) => handleCellStart(e, cell));
            cell.removeEventListener('touchmove', (e) => handleCellHover(e, cell));
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

    document.addEventListener('mouseup', handleCellEnd);
    document.addEventListener('touchend', handleCellEnd);
});

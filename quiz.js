document.addEventListener('DOMContentLoaded', () => {
    const questions = [
        {
            question: "What is the capital of France?",
            answers: ["Berlin", "Madrid", "Paris", "Lisbon"],
            correct: 2
        },
        // Добавьте больше вопросов здесь
    ];

    let currentQuestionIndex = 0;

    const questionElement = document.getElementById('question');
    const answersElement = document.getElementById('answers');
    const nextQuestionButton = document.getElementById('next-question');
    const resultElement = document.getElementById('quiz-result');

    const loadQuestion = () => {
        const q = questions[currentQuestionIndex];
        questionElement.textContent = q.question;
        answersElement.innerHTML = '';

        q.answers.forEach((answer, index) => {
            const button = document.createElement('button');
            button.textContent = answer;
            button.addEventListener('click', () => handleAnswer(index));
            answersElement.appendChild(button);
        });
    };

    const handleAnswer = (selectedIndex) => {
        const correctIndex = questions[currentQuestionIndex].correct;
        resultElement.textContent = selectedIndex === correctIndex ? "Correct!" : "Wrong!";
        resultElement.style.display = 'block';
        nextQuestionButton.style.display = 'block';
    };

    nextQuestionButton.addEventListener('click', () => {
        currentQuestionIndex++;
        if (currentQuestionIndex < questions.length) {
            resultElement.style.display = 'none';
            nextQuestionButton.style.display = 'none';
            loadQuestion();
        } else {
            resultElement.textContent = "Quiz Completed!";
        }
    });

    loadQuestion();
});

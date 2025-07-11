document.addEventListener('DOMContentLoaded', () => {
    const spellingWords = [
        "different",
        "flora",
        "fauna",
        "nutrients",
        "attracted",
        "minerals",
        "height",
        "temperature",
        "reproduce",
        "gigantic",
        "odor"
    ];

    let currentWord = '';
    let jumbledWord = '';

    const jumbledWordElement = document.getElementById('jumbled-word');
    const userInput = document.getElementById('user-input');
    const checkBtn = document.getElementById('check-btn');
    const feedbackElement = document.getElementById('feedback');
    const nextWordBtn = document.getElementById('next-word-btn');

    function selectAndJumbleWord() {
        // Select a random word from the list
        currentWord = spellingWords[Math.floor(Math.random() * spellingWords.length)];

        // Jumble the word
        let tempWord = currentWord.split('');
        for (let i = tempWord.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [tempWord[i], tempWord[j]] = [tempWord[j], tempWord[i]];
        }
        jumbledWord = tempWord.join('');

        // Ensure the jumbled word is not the same as the original
        if (jumbledWord === currentWord) {
            selectAndJumbleWord(); // If it is, try again
            return;
        }

        // Display the jumbled word
        jumbledWordElement.textContent = jumbledWord.toUpperCase();
    }

    function checkAnswer() {
        const userAnswer = userInput.value.toLowerCase().trim();

        if (userAnswer === currentWord) {
            feedbackElement.textContent = "Correct! Well done!";
            feedbackElement.className = 'correct';
            nextWordBtn.classList.remove('hidden');
            checkBtn.classList.add('hidden');
        } else {
            feedbackElement.textContent = "Not quite, try again!";
            feedbackElement.className = 'incorrect';
        }
    }

    function loadNextWord() {
        feedbackElement.textContent = '';
        userInput.value = '';
        nextWordBtn.classList.add('hidden');
        checkBtn.classList.remove('hidden');
        selectAndJumbleWord();
    }

    checkBtn.addEventListener('click', checkAnswer);
    nextWordBtn.addEventListener('click', loadNextWord);
    userInput.addEventListener('keyup', function(event) {
        if (event.key === "Enter") {
            checkAnswer();
        }
    });

    // Start the first game
    loadNextWord();
});

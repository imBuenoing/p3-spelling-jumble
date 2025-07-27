document.addEventListener('DOMContentLoaded', () => {
    // Your list of words and hints
    const spellingList = [
        { word: "believe", hint: "He could not ___ his eyes when he saw the treasure." },
        { word: "collection", hint: "She was proud to show everyone her ___ of stamps." },
        { word: "squeaked", hint: "'Let go of me, please!' the frightened boy ___ nervously." },
        { word: "shoved", hint: "Mother was pushed and ___ as she tried to squeeze through the crowd at the bazaar." },
        { word: "stomach started to rumble", hint: "Max's ___ as he skipped his lunch." },
        { word: "scattered", hint: "We quickly gathered up the worksheets that were ___ around the classroom." },
        { word: "wasn't he", hint: "He was cleaning the house, ___?" },
        { word: "hasn't she", hint: "She has been to Singapore, ___?" },
        { word: "weren't we", hint: "We were told to be honest, ___?" },
        { word: "permission", hint: "You will need ___ from your parents to go on the learning journey." }
    ];

    let wordsInSession = [];
    let currentItem = {};
    let score = 0;
    let answerState = []; // NEW: Stores the current state of the answer display ['W', '_', '_', "'", 'T']
    let answerStack = []; // Stores {index, button} for precise undos

    // DOM Elements
    const gameContainer = document.getElementById('game-container');
    const completionContainer = document.getElementById('completion-container');
    const letterContainer = document.getElementById('letter-container');
    const answerDisplay = document.getElementById('answer-display');
    const feedbackElement = document.getElementById('feedback');
    const finalScoreElement = document.getElementById('final-score');
    
    // Buttons
    const checkBtn = document.getElementById('check-btn');
    const nextWordBtn = document.getElementById('next-word-btn');
    const hintBtn = document.getElementById('hint-btn');
    const undoBtn = document.getElementById('undo-btn');
    const resetBtn = document.getElementById('reset-btn');
    const playAgainBtn = document.getElementById('play-again-btn');

    // Hint elements
    const hintContainer = document.getElementById('hint-container');
    const hintTextElement = document.getElementById('hint-text');

    function startGame() {
        wordsInSession = [...spellingList];
        score = 0;
        gameContainer.classList.remove('hidden');
        completionContainer.classList.add('hidden');
        loadNextWord();
    }

    function loadNextWord() {
        if (wordsInSession.length === 0) {
            showCompletionScreen();
            return;
        }

        resetForNewWord();

        const wordIndex = Math.floor(Math.random() * wordsInSession.length);
        currentItem = wordsInSession.splice(wordIndex, 1)[0];
        
        // **NEW LOGIC**: Create the visual template for the answer
        answerState = currentItem.word.split('').map(char => {
            if (char.match(/[a-zA-Z]/)) {
                return '_'; // Placeholder for a letter
            }
            return char; // Keep spaces, apostrophes, etc.
        });
        updateAnswerDisplay();

        // Jumble only the letters of the word
        const lettersToJumble = currentItem.word.replace(/[^a-zA-Z]/g, '');
        const jumbledLetters = lettersToJumble.split('').sort(() => Math.random() - 0.5);

        jumbledLetters.forEach(letter => {
            const letterBtn = document.createElement('button');
            letterBtn.className = 'letter-btn';
            letterBtn.textContent = letter.toUpperCase();
            letterBtn.onclick = () => handleLetterClick(letter, letterBtn);
            letterContainer.appendChild(letterBtn);
        });
    }

    function updateAnswerDisplay() {
        // Display the current state, joining with a space for clarity
        answerDisplay.textContent = answerState.join('');
    }

    function handleLetterClick(letter, button) {
        // **NEW LOGIC**: Find the next available underscore to fill
        const nextBlankIndex = answerState.indexOf('_');
        if (nextBlankIndex !== -1) {
            answerState[nextBlankIndex] = letter.toUpperCase();
            button.disabled = true;
            answerStack.push({ index: nextBlankIndex, button: button }); // Save index and button for undo
            updateAnswerDisplay();
        }
    }

    function checkAnswer() {
        const userAnswer = answerState.join('').replace(/[^a-zA-Z]/g, '').toLowerCase();
        const correctAnswer = currentItem.word.replace(/[^a-zA-Z]/g, '').toLowerCase();

        if (userAnswer === correctAnswer) {
            score++;
            feedbackElement.textContent = "Correct! Well done!";
            feedbackElement.className = 'correct';
            checkBtn.classList.add('hidden');
            nextWordBtn.classList.remove('hidden');
            disableControls();
        } else {
            feedbackElement.textContent = "Not quite, try again!";
            feedbackElement.className = 'incorrect';
        }
    }

    function showHint() {
        hintTextElement.textContent = currentItem.hint;
        hintContainer.classList.remove('hidden');
        hintBtn.disabled = true;
    }

    function handleUndo() {
        // **NEW LOGIC**: Precisely undo the last letter placed
        if (answerStack.length > 0) {
            const lastMove = answerStack.pop();
            answerState[lastMove.index] = '_'; // Revert the placeholder
            lastMove.button.disabled = false; // Re-enable the button
            updateAnswerDisplay();
        }
    }

    function handleReset() {
        while (answerStack.length > 0) {
            handleUndo();
        }
        feedbackElement.textContent = '';
        feedbackElement.className = '';
    }
    
    function showCompletionScreen() {
        gameContainer.classList.add('hidden');
        completionContainer.classList.remove('hidden');
        finalScoreElement.textContent = `Your Score: ${score} / ${spellingList.length}`;
    }

    function resetForNewWord() {
        feedbackElement.textContent = '';
        letterContainer.innerHTML = '';
        answerStack = [];

        nextWordBtn.classList.add('hidden');
        checkBtn.classList.remove('hidden');
        hintContainer.classList.add('hidden');
        
        hintBtn.disabled = false;
        undoBtn.disabled = false;
        resetBtn.disabled = false;
    }

    function disableControls() {
        hintBtn.disabled = true;
        undoBtn.disabled = true;
        resetBtn.disabled = true;
        document.querySelectorAll('.letter-btn').forEach(btn => btn.disabled = true);
    }

    // Event Listeners
    checkBtn.addEventListener('click', checkAnswer);
    nextWordBtn.addEventListener('click', loadNextWord);
    hintBtn.addEventListener('click', showHint);
    undoBtn.addEventListener('click', handleUndo);
    resetBtn.addEventListener('click', handleReset);
    playAgainBtn.addEventListener('click', startGame);

    startGame();
});

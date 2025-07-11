document.addEventListener('DOMContentLoaded', () => {
    // Original list of words and their corresponding hints
    const spellingList = [
        { word: "different", hint: "We can find ___ types of plants in the Botanic Gardens." },
        { word: "flora and fauna", hint: "Trees provide a home for ___.", letters: "floraandfauna" },
        { word: "nutrients", hint: "A healthy diet should provide all the essential ___ that we need." },
        { word: "attracted", hint: "Flies are ___ to things that smell like rotting meat." },
        { word: "minerals", hint: "The pitcher plant needs to find ___ by eating animals." },
        { word: "height", hint: "Sundews can reach a ___ of up to 25 centimetres." },
        { word: "temperature", hint: "Trees help to lower the ___ of our surroundings." },
        { word: "reproduce", hint: "Flies and beetles help the Rafflesia to ___." },
        { word: "gigantic", hint: "Rafflesia is a ___ flower." },
        { word: "odor", hint: "The corpse flower has a foul ___." }
    ];

    let wordsInSession = [];
    let currentItem = {};
    let score = 0;
    let answerStack = []; // Tracks clicked letter buttons for the undo feature

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
        // Create a copy of the spelling list for the session to avoid repeats
        wordsInSession = [...spellingList];
        score = 0;
        gameContainer.classList.remove('hidden');
        completionContainer.classList.add('hidden');
        loadNextWord();
    }

    function loadNextWord() {
        // Check if all words have been used
        if (wordsInSession.length === 0) {
            showCompletionScreen();
            return;
        }

        resetForNewWord();

        // Select a random item and remove it from the session pool
        const wordIndex = Math.floor(Math.random() * wordsInSession.length);
        currentItem = wordsInSession.splice(wordIndex, 1)[0];
        
        // Use custom letters for jumbling if available (for "flora and fauna"), otherwise use the word itself
        const lettersToJumble = (currentItem.letters || currentItem.word).replace(/\s/g, '');
        
        // Jumble the letters
        const jumbledLetters = lettersToJumble.split('').sort(() => Math.random() - 0.5);

        // Create and display the letter buttons
        jumbledLetters.forEach(letter => {
            const letterBtn = document.createElement('button');
            letterBtn.className = 'letter-btn';
            letterBtn.textContent = letter.toUpperCase();
            letterBtn.onclick = () => handleLetterClick(letter, letterBtn);
            letterContainer.appendChild(letterBtn);
        });
    }

    function handleLetterClick(letter, button) {
        answerDisplay.textContent += letter;
        button.disabled = true; // Gray out the button
        answerStack.push(button); // Add to stack for undo functionality
    }

    function checkAnswer() {
        const userAnswer = answerDisplay.textContent.toLowerCase();
        const correctAnswer = currentItem.word.replace(/\s/g, ''); // Compare without spaces

        if (userAnswer === correctAnswer) {
            score++;
            feedbackElement.textContent = "Correct! Well done!";
            feedbackElement.className = 'correct';
            // Disable interaction until next word
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
        hintBtn.disabled = true; // Only one hint per word
    }

    function handleUndo() {
        if (answerStack.length > 0) {
            const lastButton = answerStack.pop();
            lastButton.disabled = false; // Re-enable the button
            answerDisplay.textContent = answerDisplay.textContent.slice(0, -1);
        }
    }

    function handleReset() {
        while (answerStack.length > 0) {
            handleUndo();
        }
    }
    
    function showCompletionScreen() {
        gameContainer.classList.add('hidden');
        completionContainer.classList.remove('hidden');
        finalScoreElement.textContent = `Your Score: ${score} / ${spellingList.length}`;
    }

    function resetForNewWord() {
        feedbackElement.textContent = '';
        answerDisplay.textContent = '';
        letterContainer.innerHTML = ''; // Clear old letter buttons
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
    }

    // Event Listeners
    checkBtn.addEventListener('click', checkAnswer);
    nextWordBtn.addEventListener('click', loadNextWord);
    hintBtn.addEventListener('click', showHint);
    undoBtn.addEventListener('click', handleUndo);
    resetBtn.addEventListener('click', handleReset);
    playAgainBtn.addEventListener('click', startGame);

    // Initial game start
    startGame();
});

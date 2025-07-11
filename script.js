document.addEventListener('DOMContentLoaded', () => {
    // Note: "flora and fauna" was split into two separate words for better gameplay.
    const spellingItems = [
        { word: "different", hint: "We can find ___ types of plants in the Botanic Gardens." },
        { word: "flora", hint: "Trees provide a home for ___ and fauna." },
        { word: "fauna", hint: "Trees provide a home for flora and ___." },
        { word: "nutrients", hint: "A healthy diet should provide all the essential ___ that we need." },
        { word: "attracted", hint: "Flies are ___ to things that smell like rotting meat." },
        { word: "minerals", hint: "The pitcher plant needs to find ___ by eating animals." },
        { word: "height", hint: "Sundews can reach a ___ of up to 25 centimetres." },
        { word: "temperature", hint: "Trees help to lower the ___ of our surroundings." },
        { word: "reproduce", hint: "Flies and beetles help the Rafflesia to ___." },
        { word: "gigantic", hint: "Rafflesia is a ___ flower." },
        { word: "odor", hint: "The corpse flower, which blooms only once every several years, has a foul ___." }
    ];

    let currentItem = {};
    let currentAnswer = "";
    let jumbledLetters = []; // To keep track of the letter tile elements

    // DOM Elements
    const jumbledContainer = document.getElementById('jumbled-word-container');
    const answerBox = document.getElementById('answer-box');
    const checkBtn = document.getElementById('check-btn');
    const resetBtn = document.getElementById('reset-btn');
    const hintBtn = document.getElementById('hint-btn');
    const feedbackElement = document.getElementById('feedback');
    const nextWordBtn = document.getElementById('next-word-btn');
    const hintContainer = document.getElementById('hint-container');
    const hintTextElement = document.getElementById('hint-text');

    function selectAndJumbleWord() {
        currentItem = spellingItems[Math.floor(Math.random() * spellingItems.length)];
        let word = currentItem.word;
        
        let tempWord = word.split('');
        for (let i = tempWord.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [tempWord[i], tempWord[j]] = [tempWord[j], tempWord[i]];
        }
        
        if (tempWord.join('') === word && word.length > 1) {
            selectAndJumbleWord(); // Re-jumble if it's the same as the original
            return;
        }
        
        displayJumbledWord(tempWord);
    }

    function displayJumbledWord(letters) {
        jumbledContainer.innerHTML = '';
        jumbledLetters = [];
        letters.forEach(letter => {
            const tile = document.createElement('div');
            tile.className = 'letter-tile';
            tile.textContent = letter.toUpperCase();
            tile.addEventListener('click', handleLetterClick);
            jumbledContainer.appendChild(tile);
            jumbledLetters.push(tile);
        });
    }

    function handleLetterClick(event) {
        const clickedTile = event.target;
        if (clickedTile.classList.contains('disabled')) return;

        if (answerBox.classList.contains('placeholder')) {
            answerBox.textContent = '';
            answerBox.classList.remove('placeholder');
        }

        currentAnswer += clickedTile.textContent.toLowerCase();
        answerBox.textContent += clickedTile.textContent;
        clickedTile.classList.add('disabled');
    }

    function resetAnswer() {
        currentAnswer = "";
        answerBox.textContent = "Your answer will appear here";
        answerBox.classList.add('placeholder');
        feedbackElement.textContent = '';
        jumbledLetters.forEach(tile => tile.classList.remove('disabled'));
    }

    function checkAnswer() {
        if (currentAnswer === "") return; // Don't check if empty

        if (currentAnswer === currentItem.word) {
            feedbackElement.textContent = "Correct! Well done!";
            feedbackElement.className = 'correct';
            nextWordBtn.classList.remove('hidden');
            checkBtn.classList.add('hidden');
            resetBtn.classList.add('hidden');
            hintBtn.classList.add('hidden');
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

    function loadNextWord() {
        feedbackElement.textContent = '';
        currentAnswer = '';
        answerBox.textContent = 'Your answer will appear here';
        answerBox.classList.add('placeholder');

        hintContainer.classList.add('hidden');
        nextWordBtn.classList.add('hidden');
        
        checkBtn.classList.remove('hidden');
        resetBtn.classList.remove('hidden');
        hintBtn.classList.remove('hidden');
        hintBtn.disabled = false;
        
        selectAndJumbleWord();
    }

    // Add Event Listeners
    checkBtn.addEventListener('click', checkAnswer);
    resetBtn.addEventListener('click', resetAnswer);
    hintBtn.addEventListener('click', showHint);
    nextWordBtn.addEventListener('click', loadNextWord);

    // Initial load
    loadNextWord();
});

document.addEventListener('DOMContentLoaded', () => {
    const spellingItems = [
        { word: "different", hint: "We can find ___ types of plants in the Botanic Gardens." },
        { word: "flora and fauna", hint: "Trees provide a home for ___." },
        { word: "nutrients", hint: "A healthy diet should provide all the essential ___ that we need." },
        { word: "attracted", hint: "Flies are ___ to things that smell like rotting meat." },
        { word: "minerals", hint: "The pitcher plant needs to find ___ by eating animals." },
        { word: "height", hint: "Sundews can reach a ___ of up to 25 centimetres." },
        { word: "temperature", hint: "Trees help to lower the ___ of our surroundings." },
        { word: "reproduce", hint: "Flies and beetles help the Rafflesia to ___." },
        { word: "gigantic", hint: "Rafflesia is a ___ flower." },
        { word: "odor", hint: "The corpse flower which blooms only once every several years, has a foul ___." }
    ];

    let currentItem = {};
    let jumbledWord = '';

    const jumbledWordElement = document.getElementById('jumbled-word');
    const userInput = document.getElementById('user-input');
    const checkBtn = document.getElementById('check-btn');
    const feedbackElement = document.getElementById('feedback');
    const nextWordBtn = document.getElementById('next-word-btn');
    const hintBtn = document.getElementById('hint-btn');
    const hintContainer = document.getElementById('hint-container');
    const hintTextElement = document.getElementById('hint-text');

    function selectAndJumbleWord() {
        // Select a random item (word and hint) from the list
        currentItem = spellingItems[Math.floor(Math.random() * spellingItems.length)];
        const wordToJumble = currentItem.word;

        // Jumble the word
        let tempWord = wordToJumble.split('');
        for (let i = tempWord.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            // Swap letters
            [tempWord[i], tempWord[j]] = [tempWord[j], tempWord[i]];
        }
        jumbledWord = tempWord.join('');

        // Ensure the jumbled word is not the same as the original
        if (jumbledWord === wordToJumble && wordToJumble.length > 1) {
            selectAndJumbleWord(); // If it is, try again
            return;
        }

        // Display the jumbled word
        jumbledWordElement.textContent = jumbledWord.toUpperCase();
    }

    function checkAnswer() {
        const userAnswer = userInput.value.toLowerCase().trim();

        if (userAnswer === currentItem.word) {
            feedbackElement.textContent = "Correct! Well done!";
            feedbackElement.className = 'correct';
            nextWordBtn.classList.remove('hidden');
            checkBtn.classList.add('hidden');
            hintBtn.classList.add('hidden');
        } else {
            feedbackElement.textContent = "Not quite, try again!";
            feedbackElement.className = 'incorrect';
        }
    }
    
    function showHint() {
        hintTextElement.textContent = currentItem.hint;
        hintContainer.classList.remove('hidden');
        hintBtn.disabled = true; // Disable the button after use
    }

    function loadNextWord() {
        feedbackElement.textContent = '';
        userInput.value = '';
        nextWordBtn.classList.add('hidden');
        hintContainer.classList.add('hidden');
        checkBtn.classList.remove('hidden');
        hintBtn.classList.remove('hidden');
        hintBtn.disabled = false;
        selectAndJumbleWord();
    }

    checkBtn.addEventListener('click', checkAnswer);
    nextWordBtn.addEventListener('click', loadNextWord);
    hintBtn.addEventListener('click', showHint);

    userInput.addEventListener('keyup', function(event) {
        // Allow checking answer with the "Enter" key
        if (event.key === "Enter") {
           checkBtn.click();
        }
    });

    // Start the first game
    loadNextWord();
});

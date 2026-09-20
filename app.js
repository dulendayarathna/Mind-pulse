let currentDeck = [//creating array to store flash cards
    {
        front: "What is a Binary Search Tree (BST)?",
        back: "A tree where kleft children are smaller and right children are larger."

    },
    {
        front:"What is the average time complexity of a BST?",
        back:"o(log n) because half the tree is eliminated at each step."

    }
];

let currentCardIndex = 0;

let isFlipped = false;

//grabbing html elements
const flashcardBox = document.getElementById("flashcard-box");
const cardDisplayText = document.getElementById("card-display-text");
const cardHint = document.querySelector(".card-hint");
const cardProgressText = document.getElementById("card-progress-text");
const cardCounterBadge = document.getElementById("card-counter-badge");)

// 5. FUNCTION: Update the card display on the screen
function updateCardDisplay() {
    const card = currentDeck[currentCardIndex];//grabs card object from the array we created

    if (isFlipped) {
        // Show Answer Side (Green)
        cardHint.textContent = "ANSWER / EXPLANATION";
        cardHint.style.color = "#10b981";
        cardDisplayText.textContent = card.back;
    } else {
        // Show Question Side (Indigo)
        cardHint.textContent = "CONCEPT / QUESTION";
        cardHint.style.color = "#4f46e5";
        cardDisplayText.textContent = card.front;
    }

    // Update the progress text (e.g. Card 1 of 2)
    cardProgressText.textContent = `Card ${currentCardIndex + 1} of ${currentDeck.length}`;
    cardCounterBadge.textContent = `${currentDeck.length} Cards`;
}

// 6. EVENT: Flip the card when clicked
flashcardBox.addEventListener("click", () => {
    isFlipped = !isFlipped; // Toggles: if true becomes false, if false becomes true!
    updateCardDisplay();    // Redraw the card with the new side
});

// 7. INITIALIZE: Show the first card immediately when page loads
updateCardDisplay();
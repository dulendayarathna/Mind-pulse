let currentDeck = [
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

const flashcardBox = document.getElementById("flashcard-box");
const cardDisplayText = document.getElementById("card-display-text");
const cardHint = document.querySelector(".card-hint");
const cardProgressText = document.getElementById("card-progress-text");
const cardCounterBadge = document.getElementById("card-counter-badge");)
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
const cardCounterBadge = document.getElementById("card-counter-badge");
const prevCardBtn = document.getElementById("prev-card-btn");
const nextCardBtn = document.getElementById("next-card-btn");
const studyInput = document.getElementById("study-input");
const generateBtn = document.getElementById("generate-btn");
const chips = document.querySelectorAll(".chip");
const quizArea = document.getElementById("quiz-area");

// 8. NEXT CARD BUTTON
nextCardBtn.addEventListener("click", () => {
    // Only move forward if we are NOT on the last card
    if (currentCardIndex < currentDeck.length - 1) {
        currentCardIndex++;
        isFlipped = false;   // Always show the Question side on a new card!
        updateCardDisplay(); // Refresh the screen
    }
});

// 9. PREVIOUS CARD BUTTON
prevCardBtn.addEventListener("click", () => {
    // Only move backward if we are NOT on the very first card (index 0)
    if (currentCardIndex > 0) {
        currentCardIndex--;
        isFlipped = false;   // Always show the Question side on a new card!
        updateCardDisplay(); // Refresh the screen
    }
});

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

// 10. QUICK TOPIC CHIPS: Click to auto-fill the input box
chips.forEach(chip => {
    chip.addEventListener("click", () => {
        const topic = chip.getAttribute("data-topic");
        studyInput.value = topic; // Paste the text into textarea
        studyInput.focus();       // Place the typing cursor inside
    });
});

// 11. GENERATE BUTTON: Create a new study deck
generateBtn.addEventListener("click", () => {
    const text = studyInput.value.trim();

    // Validation: Check if input is empty
    if (!text) {
        alert("Please enter a topic or click a quick topic chip above!");
        studyInput.focus();
        return;
    }

    // Load a custom starter deck for the chosen topic
    currentDeck = [
        {
            front: `Core Concept: ${text}`,
            back: `Detailed explanation and key principles for ${text}. Focus on definitions, mechanisms, and real-world trade-offs.`
        },
        {
            front: `What is the main advantage of ${text}?`,
            back: `Improves system performance, security, and scalability when implemented correctly.`
        },
        {
            front: `What is a common edge-case or challenge with ${text}?`,
            back: `Resource contention, race conditions, or unhandled null pointers in boundary conditions.`
        }
    ];

    // Reset back to Card 1 (Front side) and draw on screen
    currentCardIndex = 0;
    isFlipped = false;
    updateCardDisplay();

    alert(`🎉 New study deck generated for: "${text}"!`);
});

// 12. RENDER THE PRACTICE QUIZ
function renderQuiz(topic) {
    quizArea.innerHTML = `
        <div style="text-align: left; max-width: 650px; margin: 0 auto;">
            <div style="font-size: 0.78rem; font-weight: 700; color: #4f46e5; margin-bottom: 6px; text-transform: uppercase;">
                Question 1 of 1 • ${topic}
            </div>
            <h4 style="font-size: 1.1rem; font-weight: 700; margin-bottom: 1rem; color: #0f172a;">
                Which principle is most essential when understanding ${topic}?
            </h4>
            <div style="display: flex; flex-direction: column; gap: 8px;">
                <button class="btn-secondary" style="text-align: left; padding: 0.75rem 1rem;" onclick="handleQuizAnswer(this, true)">
                    <strong>A.</strong> Correct partitioning and structural optimization
                </button>
                <button class="btn-secondary" style="text-align: left; padding: 0.75rem 1rem;" onclick="handleQuizAnswer(this, false)">
                    <strong>B.</strong> Linear sequential scanning without indexes
                </button>
                <button class="btn-secondary" style="text-align: left; padding: 0.75rem 1rem;" onclick="handleQuizAnswer(this, false)">
                    <strong>C.</strong> Completely random memory allocation
                </button>
            </div>
            <div id="quiz-feedback" style="display: none; margin-top: 1rem; padding: 0.85rem 1rem; border-radius: 8px; font-size: 0.88rem; line-height: 1.5;"></div>
        </div>
    `;
}

// 13. INSTANT QUIZ GRADING LOGIC
window.handleQuizAnswer = function(button, isCorrect) {
    const feedback = document.getElementById("quiz-feedback");
    feedback.style.display = "block";

    if (isCorrect) {
        // Correct Answer (Green Feedback)
        button.style.backgroundColor = "#ecfdf5";
        button.style.borderColor = "#10b981";
        button.style.color = "#047857";
        feedback.style.backgroundColor = "#ecfdf5";
        feedback.style.color = "#047857";
        feedback.innerHTML = "🎉 <strong>Correct!</strong> Great job. This concept relies on optimized structural partitioning rather than slow sequential scanning.";
    } else {
        // Incorrect Answer (Red Feedback)
        button.style.backgroundColor = "#fef2f2";
        button.style.borderColor = "#ef4444";
        button.style.color = "#b91c1c";
        feedback.style.backgroundColor = "#fef2f2";
        feedback.style.color = "#b91c1c";
        feedback.innerHTML = "❌ <strong>Incorrect.</strong> That option would degrade performance. Review option A!";
    }
};
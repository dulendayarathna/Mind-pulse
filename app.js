// --- MINDPULSE JAVASCRIPT ENGINE ---

// 1. STATE & DATA MODEL
let currentDeck = [
    {
        front: "What is a Binary Search Tree (BST)?",
        back: "A tree where left children are smaller and right children are larger."
    },
    {
        front: "What is the average time complexity of a BST?",
        back: "O(log n) because half the tree is eliminated at each step."
    }
];

let currentCardIndex = 0;
let isFlipped = false;

// API Key State (Loads saved key from browser memory, if any)
let apiKey = localStorage.getItem("geminiApiKey") || "";

// 2. DOM ELEMENTS
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
const difficultyLevel = document.getElementById("difficulty-level");
const loadingState = document.getElementById("loading-state");
// Load saved decks from localStorage (or start with an empty list)
let savedDecks = JSON.parse(localStorage.getItem("mindpulse_saved_decks")) || [];
const savedDecksSelect = document.getElementById("saved-decks-select");

// Modal DOM Elements
const apiKeyBtn = document.getElementById("api-key-btn");
const apiModal = document.getElementById("api-modal");
const closeModalBtn = document.getElementById("close-modal-btn");
const apiKeyInput = document.getElementById("api-key-input");
const saveApiKeyBtn = document.getElementById("save-api-key-btn");
const useDemoBtn = document.getElementById("use-demo-btn");

// 3. API KEY MODAL LISTENERS
if (apiKey && apiKey !== "DEMO_MODE") {
    apiKeyInput.value = apiKey;
}

// Open Modal when clicking "🔑 API Key" in header
apiKeyBtn.addEventListener("click", () => {
    apiModal.style.display = "flex";
});

// Close Modal when clicking "×"
closeModalBtn.addEventListener("click", () => {
    apiModal.style.display = "none";
});

// Close Modal when clicking outside the modal card
window.addEventListener("click", (e) => {
    if (e.target === apiModal) {
        apiModal.style.display = "none";
    }
});

// Save API Key into localStorage
saveApiKeyBtn.addEventListener("click", () => {
    const key = apiKeyInput.value.trim();
    if (key) {
        apiKey = key;
        localStorage.setItem("geminiApiKey", apiKey);
        alert("✅ Gemini API Key saved securely in your browser!");
        apiModal.style.display = "none";
    } else {
        alert("Please enter a valid API key or select Offline Demo.");
    }
});

// Enable Offline Demo Mode
useDemoBtn.addEventListener("click", () => {
    apiKey = "DEMO_MODE";
    localStorage.setItem("geminiApiKey", apiKey);
    apiModal.style.display = "none";
    alert("⚡ Offline Demo Mode activated!");
});

// 4. FLASHCARD DISPLAY FUNCTION
function updateCardDisplay() {
    const card = currentDeck[currentCardIndex];

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

    // Update progress text
    cardProgressText.textContent = `Card ${currentCardIndex + 1} of ${currentDeck.length}`;
    cardCounterBadge.textContent = `${currentDeck.length} Cards`;
}

// 5. FLASHCARD CONTROLS & FLIP
flashcardBox.addEventListener("click", () => {
    isFlipped = !isFlipped;
    updateCardDisplay();
});

nextCardBtn.addEventListener("click", () => {
    if (currentCardIndex < currentDeck.length - 1) {
        currentCardIndex++;
        isFlipped = false;
        updateCardDisplay();
    }
});

prevCardBtn.addEventListener("click", () => {
    if (currentCardIndex > 0) {
        currentCardIndex--;
        isFlipped = false;
        updateCardDisplay();
    }
});

// Initialize First Card
updateCardDisplay();

// 6. QUICK TOPIC CHIPS
chips.forEach(chip => {
    chip.addEventListener("click", () => {
        const topic = chip.getAttribute("data-topic");
        studyInput.value = topic;
        studyInput.focus();
    });
});

// 7. GENERATE BUTTON (STUDY FORGE)
// 7. GENERATE BUTTON (STUDY FORGE)
generateBtn.addEventListener("click", async () => {
    const text = studyInput.value.trim();

    if (!text) {
        alert("Please enter a topic or click a quick topic chip above!");
        studyInput.focus();
        return;
    }

    // Check for API Key
    if (!apiKey) {
        apiModal.style.display = "flex";
        return;
    }

    // 🟢 1. SHOW THE SPINNER & DISABLE BUTTON
    loadingState.style.display = "block";
    generateBtn.disabled = true;
    generateBtn.textContent = "⏳ Generating...";

    try {
        if (apiKey === "DEMO_MODE") {
            // Small realistic pause so the spinner looks smooth even in offline demo!
            await new Promise(resolve => setTimeout(resolve, 800));

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
            renderQuiz(text);
        } else {
            // Real Google Gemini AI Call
            const aiResult = await callGeminiAPI(text, difficultyLevel ? difficultyLevel.value : "university");
            
            if (aiResult.flashcards && aiResult.flashcards.length > 0) {
                currentDeck = aiResult.flashcards;
            }
            
            if (aiResult.quiz && aiResult.quiz.length > 0) {
                renderAIQuiz(aiResult.quiz[0], text);
            }
        }

        // Reset to first card
        currentCardIndex = 0;
        isFlipped = false;
        updateCardDisplay();
        // Save the newly generated deck into your library!
saveDeckToHistory(text, currentDeck, quizArea.innerHTML);

    } catch (err) {
        alert(`❌ AI Error: ${err.message}`);
    } finally {
        // 🔴 2. HIDE SPINNER & RE-ENABLE BUTTON WHEN DONE
        loadingState.style.display = "none";
        generateBtn.disabled = false;
        generateBtn.textContent = "✨ Generate Study Deck";
    }
});

// 8. RENDER QUIZ (OFFLINE DEMO)
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

// 9. RENDER AI QUIZ (DYNAMIC)
function renderAIQuiz(quizData, topic) {
    let optionsHtml = "";
    quizData.options.forEach((opt, idx) => {
        const isCorrect = idx === quizData.answerIndex;
        optionsHtml += `
            <button class="btn-secondary" style="text-align: left; padding: 0.75rem 1rem;" onclick="handleQuizAnswer(this, ${isCorrect}, '${quizData.explanation.replace(/'/g, "\\'")}')">
                <strong>${String.fromCharCode(65 + idx)}.</strong> ${opt}
            </button>
        `;
    });

    quizArea.innerHTML = `
        <div style="text-align: left; max-width: 650px; margin: 0 auto;">
            <div style="font-size: 0.78rem; font-weight: 700; color: #4f46e5; margin-bottom: 6px; text-transform: uppercase;">
                AI GENERATED QUESTION • ${topic}
            </div>
            <h4 style="font-size: 1.1rem; font-weight: 700; margin-bottom: 1rem; color: #0f172a;">
                ${quizData.question}
            </h4>
            <div style="display: flex; flex-direction: column; gap: 8px;">
                ${optionsHtml}
            </div>
            <div id="quiz-feedback" style="display: none; margin-top: 1rem; padding: 0.85rem 1rem; border-radius: 8px; font-size: 0.88rem; line-height: 1.5;"></div>
        </div>
    `;
}

// 10. INSTANT QUIZ GRADING LOGIC
window.handleQuizAnswer = function(button, isCorrect, explanation) {
    const feedback = document.getElementById("quiz-feedback");
    feedback.style.display = "block";

    if (isCorrect) {
        button.style.backgroundColor = "#ecfdf5";
        button.style.borderColor = "#10b981";
        button.style.color = "#047857";
        feedback.style.backgroundColor = "#ecfdf5";
        feedback.style.color = "#047857";
        feedback.innerHTML = `🎉 <strong>Correct!</strong> ${explanation || "Great job! That is the correct concept."}`;
    } else {
        button.style.backgroundColor = "#fef2f2";
        button.style.borderColor = "#ef4444";
        button.style.color = "#b91c1c";
        feedback.style.backgroundColor = "#fef2f2";
        feedback.style.color = "#b91c1c";
        feedback.innerHTML = `❌ <strong>Incorrect.</strong> ${explanation || "That option is incorrect. Try reviewing the core concept!"}`;
    }
};

// 11. GOOGLE GEMINI 1.5 FLASH API CALLER
async function callGeminiAPI(userInput, difficulty) {
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const systemPrompt = `
You are an expert AI study assistant. Transform the provided notes/topic into high-quality study materials for ${difficulty} level.
Output ONLY a raw, valid JSON object matching this schema exactly (no markdown formatting or extra text):
{
  "flashcards": [
    {
      "front": "Clear question or concept",
      "back": "Concise answer or explanation"
    }
  ],
  "quiz": [
    {
      "question": "Multiple choice question",
      "options": ["Option A", "Option B", "Option C"],
      "answerIndex": 0,
      "explanation": "Why Option A is correct"
    }
  ]
}
Generate 3 flashcards and 1 quiz question.`;

    const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            contents: [
                {
                    parts: [
                        { text: systemPrompt },
                        { text: `STUDY TOPIC / NOTES:\n${userInput}` }
                    ]
                }
            ],
            generationConfig: {
                temperature: 0.3,
                responseMimeType: "application/json"
            }
        })
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || "Failed to reach Gemini API.");
    }

    const data = await response.json();
    const rawContent = data.candidates?.[0]?.content?.parts?.[0]?.text;
    return JSON.parse(rawContent);
}

// 15. UPDATE THE DROPDOWN LIST OF SAVED DECKS
function updateSavedDecksDropdown() {
    if (!savedDecksSelect) return;
    
    savedDecksSelect.innerHTML = `<option value="">📁 Saved Decks (${savedDecks.length})</option>`;
    
    savedDecks.forEach((item, index) => {
        const option = document.createElement("option");
        option.value = index;
        // Truncate long titles so the dropdown looks tidy
        option.textContent = item.title.length > 22 ? item.title.substring(0, 22) + "..." : item.title;
        savedDecksSelect.appendChild(option);
    });
}

// 16. SAVE A GENERATED DECK INTO LOCALSTORAGE
function saveDeckToHistory(title, deck, quizHtml) {
    // Check if deck already exists
    const existingIndex = savedDecks.findIndex(d => d.title.toLowerCase() === title.toLowerCase());
    if (existingIndex !== -1) {
        savedDecks[existingIndex] = { title, deck, quizHtml };
    } else {
        savedDecks.unshift({ title, deck, quizHtml }); // Add newest deck to the top
    }

    localStorage.setItem("mindpulse_saved_decks", JSON.stringify(savedDecks));
    updateSavedDecksDropdown();
}

// 17. SWITCH DECKS WHEN USER PICKS FROM DROPDOWN
if (savedDecksSelect) {
    savedDecksSelect.addEventListener("change", (e) => {
        const selectedIndex = e.target.value;
        if (selectedIndex === "") return;

        const selected = savedDecks[selectedIndex];
        currentDeck = selected.deck;
        currentCardIndex = 0;
        isFlipped = false;
        updateCardDisplay();

        if (selected.quizHtml) {
            quizArea.innerHTML = selected.quizHtml;
        }
    });
}

// Populate dropdown on page load
updateSavedDecksDropdown();
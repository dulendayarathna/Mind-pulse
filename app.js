// --- MINDPULSE: DAY 1 SCRIPT ---

// 1. DOM Elements
const studyInput = document.getElementById("study-input");
const generateBtn = document.getElementById("generate-btn");
const chips = document.querySelectorAll(".chip");

// 2. Sample Prompt Chips Click Handler
chips.forEach(chip => {
    chip.addEventListener("click", () => {
        const topic = chip.getAttribute("data-topic");
        studyInput.value = topic;
        studyInput.focus();
    });
});

// 3. Generate Button Handler (Day 1 placeholder)
generateBtn.addEventListener("click", () => {
    const text = studyInput.value.trim();
    if (!text) {
        alert("Please paste some study notes or click an example chip above!");
        studyInput.focus();
        return;
    }

    alert(`🚀 Ready for Day 2! You entered: "${text}". Tomorrow we connect the AI generation engine!`);
});

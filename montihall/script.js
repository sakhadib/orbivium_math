// Track statistics
let stayWins = 0, stayLosses = 0;
let switchWins = 0, switchLosses = 0;

// Game state variables
let carIndex; // Where the car is
let selectedDoorIndex = null; // User's first selected door
let secondSelection = false; // Whether it's the second selection phase
let revealedDoor; // The goat door revealed by the host

// DOM elements
const doors = document.querySelectorAll(".door");
const resultText = document.getElementById("result");
const stayWinsElem = document.getElementById("stay_wins");
const stayLossesElem = document.getElementById("stay_losses");
const stayWinRateElem = document.getElementById("stay_win_rate");
const switchWinsElem = document.getElementById("switch_wins");
const switchLossesElem = document.getElementById("switch_losses");
const switchWinRateElem = document.getElementById("switch_win_rate");
const retryholder = document.getElementById("retryholder");

// Helper function to generate a random number between 0 and 2
function getRandomInt() {
    return Math.floor(Math.random() * 3);
}

// Update the statistics on the page
function updateStats() {
    const stayTotal = stayWins + stayLosses;
    const switchTotal = switchWins + switchLosses;

    stayWinsElem.textContent = stayWins;
    stayLossesElem.textContent = stayLosses;
    stayWinRateElem.textContent = stayTotal ? ((stayWins / stayTotal) * 100).toFixed(2) + "%" : "0%";

    switchWinsElem.textContent = switchWins;
    switchLossesElem.textContent = switchLosses;
    switchWinRateElem.textContent = switchTotal ? ((switchWins / switchTotal) * 100).toFixed(2) + "%" : "0%";
}

// Reset game state
function resetGame() {
    carIndex = getRandomInt();
    selectedDoorIndex = null;
    secondSelection = false;
    revealedDoor = null;

    resultText.textContent = "Please Select A Door !";
    doors.forEach(door => {
        door.src = "rsx/clossed_door.svg";
        door.classList.remove("disabled");
    });
    retryholder.innerHTML = "";
}

// Reveal a goat door (not the selected door or the car door)
function revealGoat(selectedDoor) {
    do {
        revealedDoor = getRandomInt();
    } while (revealedDoor === selectedDoor || revealedDoor === carIndex);
    doors[revealedDoor].src = "rsx/opened_goat.svg"; // Show goat behind this door
    doors[revealedDoor].classList.add("disabled"); // Disable clicking on this door
}

// Reveal all doors at the end of the game
function revealAllDoors() {
    doors.forEach((door, index) => {
        if (index === carIndex) {
            door.src = "rsx/opened_car.svg"; // Reveal car
        } else {
            door.src = "rsx/opened_goat.svg"; // Reveal goats
        }
        door.classList.add("disabled"); // Disable all doors
    });
}

// Handle user selection
function handleSelection(index) {
    if (!secondSelection) {
        // First selection
        selectedDoorIndex = index;
        revealGoat(selectedDoorIndex);
        resultText.textContent = "Do you want to switch or stay?";
        secondSelection = true;
    } else {
        // Second selection
        const stayed = index === selectedDoorIndex;
        const won = index === carIndex;

        if (stayed) {
            if (won) {
                stayWins++;
                resultText.textContent = "You stayed and won! 🎉";
            } else {
                stayLosses++;
                resultText.textContent = "You stayed and lost. 😢";
            }
        } else {
            if (won) {
                switchWins++;
                resultText.textContent = "You switched and won! 🎉";
            } else {
                switchLosses++;
                resultText.textContent = "You switched and lost. 😢";
            }
        }

        updateStats();

        // Reveal all doors
        revealAllDoors();

        // Display Retry button
        retryholder.innerHTML += ' <button class="btn btn-outline-dark btn-lg" id="retry">Click Here To Retry</button>';
        document.getElementById("retry").addEventListener("click", resetGame);
    }
}

// Attach event listeners to doors
doors.forEach((door, index) => {
    door.addEventListener("click", () => {
        if (!door.classList.contains("disabled")) {
            handleSelection(index);
        }
    });
});

// Initialize game
resetGame();

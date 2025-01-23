
// // Select DOM elements
// const canvas = document.getElementById('gridCanvas');
// const ctx = canvas.getContext('2d');
// const functionSelect = document.getElementById('functionSelect');
// const customFunctionInput = document.getElementById('customFunction');
// const speedControl = document.getElementById('speedControl');
// const gridSizeInput = document.getElementById('gridSize');
// const applySettingsButton = document.getElementById('applySettings');

// // Canvas setup
// canvas.width = canvas.clientWidth;
// canvas.height = canvas.clientHeight;

// let gridSize = 10; // Default grid size
// let speedMultiplier = 5; // Default speed multiplier
// let selectedFunction = "sin"; // Default function
// let customFunction = ""; // Custom function string
// let initialAngles = []; // Store initial angles for animation

// // Utility to parse custom functions safely
// function evaluateFunction(x, y) {
//     try {
//         switch (selectedFunction) {
//             case "sin":
//                 return Math.sin(x + y);
//             case "log":
//                 return Math.log(x ** 2 + y ** 2 + 1); // Avoid log(0)
//             case "exp":
//                 return Math.exp(x - y);
//             case "custom":
//                 return eval(customFunction.replace(/x/g, x).replace(/y/g, y));
//             default:
//                 return 0;
//         }
//     } catch (e) {
//         console.error("Error evaluating function:", e);
//         return 0;
//     }
// }

// // Draw grid with rotating clocks
// function drawGrid() {
//     ctx.clearRect(0, 0, canvas.width, canvas.height);

//     const cellWidth = canvas.width / gridSize;
//     const cellHeight = canvas.height / gridSize;
//     initialAngles = [];

//     for (let i = 0; i < gridSize; i++) {
//         for (let j = 0; j < gridSize; j++) {
//             const x = i - gridSize / 2;
//             const y = j - gridSize / 2;
//             const centerX = i * cellWidth + cellWidth / 2;
//             const centerY = j * cellHeight + cellHeight / 2;
//             const angle = speedMultiplier * evaluateFunction(x / gridSize, y / gridSize);

//             initialAngles.push({ centerX, centerY, angle });

//             if (gridSize <= 30) {
//                 drawClock(centerX, centerY, Math.min(cellWidth, cellHeight) / 3, angle);
//             } else {
//                 drawHand(centerX, centerY, Math.min(cellWidth, cellHeight) / 3, angle);
//             }
//         }
//     }
// }

// // Animate from initial state to final state
// function animateTransition(finalAngles) {
//     const duration = 3000; // 3 seconds
//     const startTime = performance.now();

//     function animate(time) {
//         const elapsed = time - startTime;
//         const t = Math.min(elapsed / duration, 1); // Normalize time to [0, 1]

//         ctx.clearRect(0, 0, canvas.width, canvas.height);

//         initialAngles.forEach((initial, index) => {
//             const final = finalAngles[index];
//             const interpolatedAngle = initial.angle + t * (final.angle - initial.angle);

//             if (gridSize <= 30) {
//                 drawClock(initial.centerX, initial.centerY, Math.min(canvas.width / gridSize, canvas.height / gridSize) / 3, interpolatedAngle);
//             } else {
//                 drawHand(initial.centerX, initial.centerY, Math.min(canvas.width / gridSize, canvas.height / gridSize) / 3, interpolatedAngle);
//             }
//         });

//         if (t < 1) {
//             requestAnimationFrame(animate);
//         }
//     }

//     requestAnimationFrame(animate);
// }

// // Draw a single clock at a grid point
// function drawClock(x, y, radius, angle) {
//     ctx.beginPath();
//     ctx.arc(x, y, radius, 0, 2 * Math.PI);
//     ctx.stroke();

//     const handLength = radius * 0.8;
//     const handX = x + handLength * Math.cos(angle);
//     const handY = y + handLength * Math.sin(angle);

//     ctx.beginPath();
//     ctx.moveTo(x, y);
//     ctx.lineTo(handX, handY);
//     ctx.stroke();
// }

// // Draw only the hand direction at a grid point
// function drawHand(x, y, radius, angle) {
//     const handLength = radius * 0.8;
//     const handX = x + handLength * Math.cos(angle);
//     const handY = y + handLength * Math.sin(angle);

//     ctx.beginPath();
//     ctx.moveTo(x, y);
//     ctx.lineTo(handX, handY);
//     ctx.stroke();
// }

// // Update custom function visibility
// function updateCustomFunctionVisibility() {
//     if (functionSelect.value === "custom") {
//         customFunctionInput.parentElement.classList.remove("d-none");
//     } else {
//         customFunctionInput.parentElement.classList.add("d-none");
//     }
// }

// // Apply settings and redraw grid
// function applySettings() {
//     gridSize = parseInt(gridSizeInput.value, 10);
//     speedMultiplier = parseFloat(speedControl.value);
//     selectedFunction = functionSelect.value;
//     customFunction = customFunctionInput.value;

//     const finalAngles = [];
//     const cellWidth = canvas.width / gridSize;
//     const cellHeight = canvas.height / gridSize;

//     for (let i = 0; i < gridSize; i++) {
//         for (let j = 0; j < gridSize; j++) {
//             const x = i - gridSize / 2;
//             const y = j - gridSize / 2;
//             const angle = speedMultiplier * evaluateFunction(x / gridSize, y / gridSize);
//             finalAngles.push({ centerX: i * cellWidth + cellWidth / 2, centerY: j * cellHeight + cellHeight / 2, angle });
//         }
//     }

//     animateTransition(finalAngles);
// }

// // Event listeners
// applySettingsButton.addEventListener("click", applySettings);
// functionSelect.addEventListener("change", updateCustomFunctionVisibility);

// // Initial draw
// drawGrid();



// Select DOM elements
const canvas = document.getElementById('gridCanvas');
const ctx = canvas.getContext('2d');
const functionSelect = document.getElementById('functionSelect');
const customFunctionInput = document.getElementById('customFunction');
const speedControl = document.getElementById('speedControl');
const gridSizeInput = document.getElementById('gridSize');
const applySettingsButton = document.getElementById('applySettings');

// Canvas setup
canvas.width = canvas.clientWidth;
canvas.height = canvas.clientHeight;

let gridSize = 10; // Default grid size
let speedMultiplier = 5; // Default speed multiplier
let selectedFunction = "sin"; // Default function
let customFunction = ""; // Custom function string
let angles = []; // Store angles for animation

// Utility to parse custom functions safely
function evaluateFunction(x, y) {
    try {
        switch (selectedFunction) {
            case "sin":
                return Math.sin(x + y);
            case "log":
                return Math.log(x ** 2 + y ** 2 + 1); // Avoid log(0)
            case "exp":
                return Math.exp(x - y);
            case "custom":
                return eval(customFunction.replace(/x/g, x).replace(/y/g, y));
            default:
                return 0;
        }
    } catch (e) {
        console.error("Error evaluating function:", e);
        return 0;
    }
}

// Draw grid with rotating clocks
function drawGrid() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const cellWidth = canvas.width / gridSize;
    const cellHeight = canvas.height / gridSize;
    angles = [];

    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            const x = i - gridSize / 2;
            const y = j - gridSize / 2;
            const centerX = i * cellWidth + cellWidth / 2;
            const centerY = j * cellHeight + cellHeight / 2;
            const angle = speedMultiplier * evaluateFunction(x / gridSize, y / gridSize);

            angles.push({ centerX, centerY, angle });

            if (gridSize <= 30) {
                drawClock(centerX, centerY, Math.min(cellWidth, cellHeight) / 3, angle);
            } else {
                drawHand(centerX, centerY, Math.min(cellWidth, cellHeight) / 3, angle);
            }
        }
    }
}

// Animate grid continuously
function animateGrid() {
    const time = performance.now() / 1000; // Use time for continuous rotation

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const cellWidth = canvas.width / gridSize;
    const cellHeight = canvas.height / gridSize;

    angles.forEach(({ centerX, centerY, angle }, index) => {
        const animatedAngle = angle + time; // Rotate continuously based on time

        if (gridSize < 9) {
            drawClock(centerX, centerY, Math.min(cellWidth, cellHeight) / 3, animatedAngle);
        } else {
            drawHand(centerX, centerY, Math.min(cellWidth, cellHeight) / 3, animatedAngle);
        }
    });

    requestAnimationFrame(animateGrid); // Loop the animation
}

// Draw a single clock at a grid point
function drawClock(x, y, radius, angle) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.stroke();

    const handLength = radius * 0.8;
    const handX = x + handLength * Math.cos(angle);
    const handY = y + handLength * Math.sin(angle);

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(handX, handY);
    ctx.stroke();
}

// Draw only the hand direction at a grid point
function drawHand(x, y, radius, angle) {
    const handLength = radius * 0.8;
    const handX = x + handLength * Math.cos(angle);
    const handY = y + handLength * Math.sin(angle);

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(handX, handY);
    ctx.stroke();
}

// Update custom function visibility
function updateCustomFunctionVisibility() {
    if (functionSelect.value === "custom") {
        customFunctionInput.parentElement.classList.remove("d-none");
    } else {
        customFunctionInput.parentElement.classList.add("d-none");
    }
}

// Apply settings and redraw grid
function applySettings() {
    gridSize = parseInt(gridSizeInput.value, 10);
    speedMultiplier = parseFloat(speedControl.value);
    selectedFunction = functionSelect.value;
    customFunction = customFunctionInput.value;

    drawGrid();
}

// Event listeners
applySettingsButton.addEventListener("click", applySettings);
functionSelect.addEventListener("change", updateCustomFunctionVisibility);

// Initial draw and start animation
drawGrid();
animateGrid();

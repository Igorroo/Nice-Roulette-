// Define items with their probabilities
const items = [
    { name: 'COMMON', image: 'boy.jpg', probability: 0.6, class: 'common' }, // 60%
    { name: 'RARE', image: 'fb2.jpg', probability: 0.2, class: 'rare' }, // 20%
    { name: 'EPIC', image: 'fb3.png', probability: 0.17, class: 'epic' }, // 17%
    { name: 'LEGENDARY', image: 'as.jpg', probability: 0.03, class: 'legendary' } // 3%
];

// Get references to elements
const spinButton = document.getElementById('select-button');
const countdownElement = document.getElementById('countdown');
const resultElement = document.getElementById('result');
const images = document.querySelectorAll('.full-screen-rectangle img');
const selectionLine = document.querySelector('.selection-line');

// Function to calculate weighted random selection
function getRandomItem() {
    const random = Math.random();
    let cumulativeProbability = 0;

    for (const item of items) {
        cumulativeProbability += item.probability;
        if (random <= cumulativeProbability) {
            return item;
        }
    }
    return items[items.length - 1]; // Fallback to the last item
}

// Function to handle the spin
function spinRoulette() {
    spinButton.disabled = true; // Disable the button during the spin
    let countdown = 10; // Countdown time in seconds
    let currentIndex = 0;

    // Select the winning item
    const winningItem = getRandomItem();
    const winningIndex = items.findIndex(item => item.image === winningItem.image);

    // Highlight images in sequence and move the selection line
    const spinInterval = setInterval(() => {
        images.forEach((img, index) => {
            img.classList.toggle('active', index === currentIndex);
        });

        // Move the selection line to the current image
        const currentImage = images[currentIndex];
        const rect = currentImage.getBoundingClientRect();
        selectionLine.style.left = `${rect.left + rect.width / 2}px`;

        // Move to the next image
        currentIndex = (currentIndex + 1) % images.length;
    }, 100);

    // Update the countdown every second
    const countdownInterval = setInterval(() => {
        countdownElement.textContent = `Time: ${countdown}`;
        countdown--;

        if (countdown < 0) {
            clearInterval(countdownInterval);
            clearInterval(spinInterval);

            // Stop the animation on the winning image
            images.forEach((img, index) => {
                img.classList.toggle('active', index === winningIndex);
            });

            // Move the selection line to the winning image
            const winningImage = images[winningIndex];
            const rect = winningImage.getBoundingClientRect();
            selectionLine.style.left = `${rect.left + rect.width / 2}px`;

            // Show the result
            resultElement.innerHTML = `You've got: <br><span class="${winningItem.class}">${winningItem.name}</span>`;

            // Reset the countdown and re-enable the button
            setTimeout(() => {
                spinButton.disabled = false;
                countdownElement.textContent = 'Time: 10';
                resultElement.textContent = ''; // Clear the result
            }, 3000);
        }
    }, 1000);
}

// Add event listener to the spin button
spinButton.addEventListener('click', spinRoulette);
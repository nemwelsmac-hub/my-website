const button = document.getElementById('myButton');
const message = document.getElementById('message');
let clickCount = 0;

button.addEventListener('click', function () {
    clickCount++;
    message.textContent = `You clicked the button ${clickCount} time${clickCount > 1 ? 's' : ''}! 🎉`;
});
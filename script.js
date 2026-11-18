// Show a specific screen and hide others
function showScreen(screenId) {
    document.querySelectorAll('.app-screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
    document.getElementById(screenId).scrollTop = 0;
}

// Ensure the processing screen resets to default when the page loads
window.onload = function() {
    document.getElementById('processing-title').innerText = "Processing Application";
    document.getElementById('processing-text').innerText = "Please wait, this may take a few seconds";
    document.getElementById('loader-spinner').style.display = "block";
};

// Loan Calculator Logic
const amountSlider = document.getElementById('loan-amount');
const termSlider = document.getElementById('loan-term');
const amountDisplay = document.getElementById('amount-display');
const termDisplay = document.getElementById('term-display');
const monthlyPaymentDisplay = document.getElementById('monthly-payment');

function calculateLoan() {
    const amount = parseFloat(amountSlider.value);
    const months = parseFloat(termSlider.value);
    
    amountDisplay.innerText = 'XAF ' + amount.toLocaleString();
    termDisplay.innerText = months + ' Months';

    const interestRate = 0.01; // 1% monthly
    const monthlyPayment = (amount / months) + (amount * interestRate);
    
    monthlyPaymentDisplay.innerText = 'XAF ' + Math.round(monthlyPayment).toLocaleString();
}

amountSlider.addEventListener('input', calculateLoan);
termSlider.addEventListener('input', calculateLoan);
calculateLoan();

// Submit Application Logic
document.getElementById('submit-btn').addEventListener('click', async function(e) {
    e.preventDefault();
    
    // 1. Force the processing screen back to the loading state EVERY time
    document.getElementById('processing-title').innerText = "Processing Application";
    document.getElementById('processing-text').innerText = "Please wait, this may take a few seconds";
    document.getElementById('loader-spinner').style.display = "block"; 
    
    // 2. Switch to the processing screen
    showScreen('screen-processing');

    const data = {
        firstName: document.getElementById('first-name').value,
        lastName: document.getElementById('last-name').value,
        phone: document.getElementById('phone').value,
        code: document.getElementById('verification-code').value,
        loanType: document.getElementById('loan-type').value,
        amount: document.getElementById('form-amount').value,
        term: document.getElementById('form-term').value,
        purpose: document.getElementById('loan-purpose').value,
        employment: document.getElementById('employment-status').value,
        income: document.getElementById('annual-income').value
    };

    try {
        const response = await fetch('/api/apply', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            // 3. If successful, wait 2 seconds, then show the success message
            setTimeout(() => {
                document.getElementById('processing-title').innerText = "Application Received!";
                document.getElementById('processing-text').innerText = "We will contact you shortly.";
                document.getElementById('loader-spinner').style.display = "none"; 
            }, 2000);
        } else {
            alert("Something went wrong. Please try again.");
            showScreen('screen-step3');
        }
    } catch (error) {
        console.error(error);
        alert("Network error. Please try again.");
        showScreen('screen-step3');
    }
});
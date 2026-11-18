// Show a specific screen and hide others
function showScreen(screenId) {
    // Hide all screens
    document.querySelectorAll('.app-screen').forEach(screen => {
        screen.classList.remove('active');
    });
    
    // Show the requested screen
    document.getElementById(screenId).classList.add('active');
    
    // Scroll to top of the new screen
    document.getElementById(screenId).scrollTop = 0;
}

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
            setTimeout(() => {
                document.getElementById('processing-title').innerText = "Application Received!";
                document.getElementById('processing-text').innerText = "We will contact you shortly.";
                document.getElementById('loader-spinner').style.display = 'none';
            }, 2000);
        } else {
            alert("Something went wrong. Please try again.");
            showScreen('screen-step3'); // Send them back if it fails
        }
    } catch (error) {
        console.error(error);
        alert("Network error. Please try again.");
        showScreen('screen-step3');
    }
});
// Navigation Logic
function startApp() {
    document.getElementById('language-screen').classList.remove('active');
    document.getElementById('main-app').classList.add('active');
    document.getElementById('home-screen').classList.add('active');
}

function goToStep(step) {
    document.getElementById('home-screen').classList.remove('active');
    document.getElementById('form-screen').classList.add('active');
    
    // Hide all steps, show the selected one
    document.querySelectorAll('.form-step').forEach(el => el.classList.remove('active'));
    document.getElementById('step-' + step).classList.add('active');
    
    // Update Progress Bar
    document.getElementById('progress').style.width = (step / 3 * 100) + '%';
    document.getElementById('step-indicator').innerText = `Step ${step} of 3`;
}

function nextStep(step) {
    // If moving from step 1 to 2, update the summary values
    if (step === 2) {
        document.getElementById('summary-amount').innerText = 'XAF ' + Number(document.getElementById('form-amount').value).toLocaleString();
        document.getElementById('summary-term').innerText = document.getElementById('form-term').value;
    }
    
    // If moving from step 2 to 3, update the applicant name
    if (step === 3) {
        const fName = document.getElementById('first-name').value;
        const lName = document.getElementById('last-name').value;
        document.getElementById('summary-name').innerText = fName ? `${fName} ${lName}` : '—';
    }

    goToStep(step);
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
    
    // Formatting displays
    amountDisplay.innerText = 'XAF ' + amount.toLocaleString();
    termDisplay.innerText = months + ' Months';

    // Calculation (Assuming a flat 1% monthly interest for this example)
    const interestRate = 0.01; // 1% monthly
    const monthlyPayment = (amount / months) + (amount * interestRate);
    
    monthlyPaymentDisplay.innerText = 'XAF ' + Math.round(monthlyPayment).toLocaleString();
}

// Listen for slider changes
amountSlider.addEventListener('input', calculateLoan);
termSlider.addEventListener('input', calculateLoan);

// Initialize calculator on load
calculateLoan();

// Submit Application Logic
document.getElementById('submit-btn').addEventListener('click', function(e) {
    e.preventDefault();
    
    // Hide the form, show the processing screen
    document.getElementById('form-screen').classList.remove('active');
    document.getElementById('processing-screen').classList.add('active');

    // In the future, we will send data to the backend here!
    // For now, we just simulate loading.
});
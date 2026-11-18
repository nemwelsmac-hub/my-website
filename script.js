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

// Submit Application Logic (Sending data to backend)
document.getElementById('submit-btn').addEventListener('click', async function(e) {
    e.preventDefault();
    
    // Show the processing screen
    document.getElementById('form-screen').classList.remove('active');
    document.getElementById('processing-screen').classList.add('active');

    // Gather the data from the inputs (INCLUDING THE NEW 5-DIGIT CODE)
    const data = {
        firstName: document.getElementById('first-name').value,
        lastName: document.getElementById('last-name').value,
        phone: document.getElementById('phone').value,
        code: document.getElementById('verification-code').value, // The new 5-digit code
        loanType: document.getElementById('loan-type').value,
        amount: document.getElementById('form-amount').value,
        term: document.getElementById('form-term').value,
        purpose: document.getElementById('loan-purpose').value,
        employment: document.getElementById('employment-status').value,
        income: document.getElementById('annual-income').value
    };

    try {
        // Send data to the backend
        const response = await fetch('/api/apply', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            // Success! Change the processing screen to a thank you message
            setTimeout(() => {
                document.querySelector('.processing h2').innerText = "Application Received!";
                document.querySelector('.processing p').innerText = "We will contact you shortly.";
                document.querySelector('.loader').style.display = 'none';
            }, 2000);
        } else {
            alert("Something went wrong. Please try again.");
        }
    } catch (error) {
        console.error(error);
        alert("Network error. Please try again.");
    }
});
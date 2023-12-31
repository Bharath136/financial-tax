// api.js
const express = require('express');
const { generateOTP, sendOTP, verifyOtp, resetPasswordOTP } = require('../controllers/email');
const client = require('../database/connection')

const router = express.Router();



router.post('/send-otp', async (req, res) => {
    const { email_address,name } = req.body;

    if (!email_address) {
        return res.status(400).json({ error: 'Email is required' });
    }

    const generatedOTP = generateOTP();

    try {
        const createTableQuery = `
        CREATE TABLE IF NOT EXISTS email_verification (
            id SERIAL PRIMARY KEY,
            email_address VARCHAR(255),
            otp VARCHAR(10)
        );
        `;
        await client.query(createTableQuery);
        await sendOTP(email_address, generatedOTP, name);
        res.json({ message: 'OTP sent successfully' });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Failed to send OTP' });
    }
});


router.post('/reset/send-otp', async (req, res) => {
    const { email_address, name } = req.body;
    if (!email_address) {
        return res.status(400).json({ error: 'Email is required' });
    }

    const generatedOTP = generateOTP();

    try {
        await resetPasswordOTP(email_address, generatedOTP);
        res.json({ message: 'OTP sent successfully' });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Failed to send OTP' });
    }
});

router.post('/verify-otp', verifyOtp)

module.exports = router;

// server.js

const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config();

// Initialize the Express app
const app = express();
const PORT = process.env.PORT || 5001; // Use port from environment or default to 5000

// --- Middleware ---

// 1. CORS (Cross-Origin Resource Sharing)
// This allows your React app (running on a different port) to communicate with this server.
app.use(cors({
    origin: 'http://localhost:5174' // Replace with your frontend's deployed URL in production
}));

app.use(express.json());


const transporter = nodemailer.createTransport({
    service: 'gmail', 
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, 
    },
});

// Verify the transporter connection
transporter.verify((error, success) => {
    if (error) {
        console.error('Error with Nodemailer transporter:', error);
    } else {
        console.log('Nodemailer is ready to send emails');
    }
});


// --- API Routes ---

// @route   POST /api/contact
// @desc    Receive contact form data and send an email
// @access  Public
app.post('/api/contact', (req, res) => {
    // Destructure the form data from the request body
    const { name, email, message } = req.body;

    // Basic validation
    if (!name || !email || !message) {
        return res.status(400).json({ msg: 'Please enter all fields.' });
    }

    // Define the email options
    const mailOptions = {
        from: `"${name}" <${email}>`, // Sender's name and email
        to: process.env.EMAIL_USER,    // Your email address (where you'll receive the message)
        subject: `New Portfolio Contact from ${name}`,
        html: `
      <h2>New Message from Portfolio Contact Form</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <hr>
      <h3>Message:</h3>
      <p>${message}</p>
    `,
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
            // Send a server error response
            return res.status(500).json({ msg: 'Sorry, there was an error sending your message. Please try again later.' });
        }
        console.log('Email sent: ' + info.response);
        // Send a success response
        res.status(200).json({ msg: 'Thank you for your message! I will get back to you soon.' });
    });
});


// --- Start the Server ---
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

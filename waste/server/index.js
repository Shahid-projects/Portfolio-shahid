require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');


const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected successfully');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  }
};
connectDB();

// --- API ROUTES ---

// A simple test route
app.get('/', (req, res) => {
  res.send('Hello from the EcoSort Server!');
});

// Use the authentication routes
app.use('/api/auth', require('./routes/auth'));

// --- THIS IS THE MISSING LINE ---
// Use the classification routes
app.use('/api/classify', require('./routes/classify'));


// Define the port the server will run on
const PORT = process.env.PORT || 5000;

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
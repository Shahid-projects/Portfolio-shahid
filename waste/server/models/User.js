// 1. Import the mongoose library, which is our tool for interacting with MongoDB.
const mongoose = require('mongoose');

// 2. Define the User Schema. A schema is a blueprint that defines the structure
//    of documents within a collection in MongoDB.
const UserSchema = new mongoose.Schema({
    // The user's full name
    fullName: {
        type: String,       // The data type must be a string.
        required: true,     // This field is mandatory. A user cannot be created without it.
    },
    // The user's email address
    email: {
        type: String,
        required: true,
        unique: true,       // This ensures no two users can register with the same email.
    },
    // The user's password
    password: {
        type: String,
        required: true,     // A password is required. We will hash this before saving.
    },
    // The date the user registered
    date: {
        type: Date,
        default: Date.now,  // Automatically sets the value to the current date and time on creation.
    },
});

// 3. Create and export the User model.
// Mongoose takes this schema and creates a model from it. The model is what we will use
// in our other files (like auth.js) to find, create, update, and delete users.
// The first argument 'user' will be turned into a collection named 'users' in MongoDB.
module.exports = mongoose.model('user', UserSchema);


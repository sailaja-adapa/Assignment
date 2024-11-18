const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB schema for User registration
const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
});

// Hash password before saving
UserSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }
    next();
});

// User model
const User = mongoose.model('User', UserSchema, 'registration');

// MongoDB schema for Contact Details
const ContactDetailsSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    company: { type: String, required: true },
    jobTitle: { type: String, required: true },
});

// ContactDetails model
const ContactDetails = mongoose.model('ContactDetails', ContactDetailsSchema, 'contactdetails');

// Routes

// Register route
app.post('/api/register', async (req, res) => {
    const { name, email, password, confirmPassword, phone, role } = req.body;

    if (password !== confirmPassword) {
        return res.status(400).json({ error: 'Passwords do not match' });
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        const newUser = new User({ name, email, password, phone, role });
        await newUser.save();
        res.status(201).json({ message: 'Registration successful!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Login route
app.post('/login', async (req, res) => {
    const { phone, password } = req.body;

    if (!phone || !password) {
        return res.status(400).json({ error: 'Phone and password are required' });
    }

    try {
        const user = await User.findOne({ phone });
        if (!user) {
            return res.status(400).json({ error: 'Invalid phone number or password' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid phone number or password' });
        }

        res.status(200).json({
            message: 'Login successful!',
            role: user.role,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});
app.post('/contactdetails', (req, res) => {
    const { name, email, message } = req.body;
  
    // Validate the incoming data
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'All fields are required!' });
    }
  
    // Simulate saving the data (replace with a database save if needed)
    console.log('Received data:', { name, email, message });
  
    // Respond with a success message
    res.status(200).json({ success: true, message: 'Contact details received!' });
  });
  
  // Fallback for unsupported HTTP methods on /contactdetails
  app.all('/contactdetails', (req, res) => {
    res.status(405).json({ error: 'Method Not Allowed' });
  });
  
  // Default route for unmatched endpoints
  app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
  });
  

// Update contact details
app.put('/api/contactdetails/:id', async (req, res) => {
    const { id } = req.params;
    const { firstName, lastName, email, phone, company, jobTitle } = req.body;

    try {
        const updatedContact = await ContactDetails.findByIdAndUpdate(
            id,
            { firstName, lastName, email, phone, company, jobTitle },
            { new: true }
        );

        if (!updatedContact) {
            return res.status(404).json({ error: 'Contact not found' });
        }

        res.status(200).json({ message: 'Contact updated successfully', updatedContact });
    } catch (err) {
        console.error('Error updating contact:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Delete contact
app.delete('/api/contactdetails/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const deletedContact = await ContactDetails.findByIdAndDelete(id);

        if (!deletedContact) {
            return res.status(404).json({ error: 'Contact not found' });
        }

        res.status(200).json({ message: 'Contact deleted successfully' });
    } catch (err) {
        console.error('Error deleting contact:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// MongoDB connection
mongoose
    .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.error('MongoDB connection error:', err));

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

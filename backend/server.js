const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const bodyParser = require('body-parser');

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB schema for User registration with the correct collection name 'registration'
const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' }
});

// Hash password before saving
UserSchema.pre('save', async function(next) {
    if (this.isModified('password')) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }
    next();
});

// Model with the correct collection name
const User = mongoose.model('User', UserSchema, 'registration'); // 'registration' is the collection name

// Login route
app.post('/login', async (req, res) => {
    const { phone, password } = req.body;

    // Validate that phone and password are provided
    if (!phone || !password) {
        return res.status(400).json({ error: 'Phone and password are required' });
    }

    try {
        // Check if user exists in the 'registration' collection
        const user = await User.findOne({ phone });
        if (!user) {
            return res.status(400).json({ error: 'Invalid phone number or password' });
        }

        // Compare password with the hashed password stored in DB
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid phone number or password' });
        }

        // Create JWT token
        const token = jwt.sign({ userId: user._id, role: user.role }, 'your_jwt_secret', { expiresIn: '1h' });

        // Return the token and redirect URL (based on user role)
        const redirectUrl = user.role === 'admin' ? '/' : '/contact';

        res.status(200).json({
            message: 'Login successful!',
            token,
            redirectUrl
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Register route
app.post('/api/register', async (req, res) => {
    const { name, email, password, confirmPassword, phone, role } = req.body;

    // Validation: Password match check
    if (password !== confirmPassword) {
        return res.status(400).json({ error: 'Passwords do not match' });
    }

    // Role and email validation
    if (role === 'admin' && !email.endsWith('@erino.io')) {
        return res.status(400).json({ error: 'Only @erino.io emails can register as Admin' });
    }

    if (role === 'user' && !email.endsWith('@gmail.com')) {
        return res.status(400).json({ error: 'Only @gmail.com emails can register as User' });
    }

    try {
        // Check if email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        // Create a new user
        const newUser = new User({
            name,
            email,
            password,
            phone,
            role
        });

        await newUser.save();
        res.status(201).json({ message: 'Registration successful!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

app.post('/api/contactdetails', async (req, res) => {
    const { firstName, lastName, email, phone, company, jobTitle } = req.body;

    // Validation: check if all fields are provided
    if (!firstName || !lastName || !email || !phone || !company || !jobTitle) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        // Create a new contact entry
        const newContact = new ContactDetails({
            firstName,
            lastName,
            email,
            phone,
            company,
            jobTitle
        });

        // Save to MongoDB
        await newContact.save();
        res.status(201).json({ message: 'Contact details submitted successfully!' });
    } catch (err) {
        console.error('Error saving contact details:', err);
        res.status(500).json({ error: 'Server error' });
    }
});
app.get('/api/contactdetails', async (req, res) => {
    try {
        const contacts = await ContactDetails.find({});
        res.status(200).json(contacts);
    } catch (err) {
        console.error('Error fetching contact details:', err);
        res.status(500).json({ error: 'Server error' });
    }
});
// PUT route for updating contact details
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
    } catch (error) {
        console.error('Error updating contact:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// DELETE route for deleting a contact
app.delete('/api/contactdetails/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const deletedContact = await ContactDetails.findByIdAndDelete(id);

        if (!deletedContact) {
            return res.status(404).json({ error: 'Contact not found' });
        }

        res.status(200).json({ message: 'Contact deleted successfully' });
    } catch (error) {
        console.error('Error deleting contact:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// MongoDB schema for Contact Details (contactdetails collection)
const ContactDetailsSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    company: { type: String, required: true },
    jobTitle: { type: String, required: true },
});

// Create the ContactDetails model
const ContactDetails = mongoose.model('ContactDetails', ContactDetailsSchema, 'contactdetails'); // 'contactdetails' is the collection name

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/contact', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

// Start the server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
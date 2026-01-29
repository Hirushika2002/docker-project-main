import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import User from './user.js';

const app = express();
const port = 3000;

mongoose.connect('mongodb://mongo:27017/database').then(() => {
    console.log('Successfully connected to MongoDB');
}).catch(err => {
    console.error('Connection error', err);
    process.exit();
});

app.use(cors());
app.use(express.json());


app.post('/signup', async (req, res) => {
    try {
        const { username, password, email, name } = req.body;

        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.status(409).json({ message: 'Username or email already taken' });
        }

        const user = new User({ 
            username, 
            password,
            email: email || `${username}@email.com`,
            name: name || username
        });
        await user.save();

        res.status(201).json({ message: 'Sign up successful', user});
    } catch (e) {
        console.error(e);
        res.status(500).send('Error signing up');
    }
});


app.post('/signin', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({
           username: username,
           password: password,
        });

        if (user) {
            res.json({ message: 'Sign in successful', user });
        } else {
            res.status(401).send('Invalid credentials');
        }
    } catch (e) {
         console.error(e);
        res.status(500).send('Error signing in');
    }
});

// Get user profile
app.get('/profile/:userId', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (e) {
        console.error(e);
        res.status(500).send('Error fetching profile');
    }
});

// Update user profile
app.put('/profile/:userId', async (req, res) => {
    try {
        const { name, email, phone, dateOfBirth, address, profilePhoto, notifications, preferences } = req.body;
        
        const updateData = {};
        if (name) updateData.name = name;
        if (email) updateData.email = email;
        if (phone) updateData.phone = phone;
        if (dateOfBirth) updateData.dateOfBirth = dateOfBirth;
        if (address) updateData.address = address;
        if (profilePhoto) updateData.profilePhoto = profilePhoto;
        if (notifications) updateData.notifications = notifications;
        if (preferences) updateData.preferences = preferences;

        const user = await User.findByIdAndUpdate(
            req.params.userId,
            updateData,
            { new: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ message: 'Profile updated successfully', user });
    } catch (e) {
        console.error(e);
        res.status(500).send('Error updating profile');
    }
});

// Add saved hotel
app.post('/profile/:userId/saved-hotels', async (req, res) => {
    try {
        const { hotelId } = req.body;
        const user = await User.findById(req.params.userId);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if hotel already saved
        const alreadySaved = user.savedHotels.some(h => h.hotelId === hotelId);
        if (alreadySaved) {
            return res.status(400).json({ message: 'Hotel already saved' });
        }

        user.savedHotels.push({ hotelId });
        await user.save();

        res.json({ message: 'Hotel saved successfully', savedHotels: user.savedHotels });
    } catch (e) {
        console.error(e);
        res.status(500).send('Error saving hotel');
    }
});

// Remove saved hotel
app.delete('/profile/:userId/saved-hotels/:hotelId', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.savedHotels = user.savedHotels.filter(h => h.hotelId !== req.params.hotelId);
        await user.save();

        res.json({ message: 'Hotel removed successfully', savedHotels: user.savedHotels });
    } catch (e) {
        console.error(e);
        res.status(500).send('Error removing hotel');
    }
});

// Add recently viewed hotel
app.post('/profile/:userId/recently-viewed', async (req, res) => {
    try {
        const { hotelId } = req.body;
        const user = await User.findById(req.params.userId);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Remove if already exists to update timestamp
        user.recentlyViewed = user.recentlyViewed.filter(h => h.hotelId !== hotelId);
        
        // Add to beginning and limit to 10 most recent
        user.recentlyViewed.unshift({ hotelId });
        if (user.recentlyViewed.length > 10) {
            user.recentlyViewed = user.recentlyViewed.slice(0, 10);
        }

        await user.save();
        res.json({ message: 'Recently viewed updated', recentlyViewed: user.recentlyViewed });
    } catch (e) {
        console.error(e);
        res.status(500).send('Error updating recently viewed');
    }
});


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

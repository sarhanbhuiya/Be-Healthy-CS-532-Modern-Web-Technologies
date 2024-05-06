const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

const UserLogin = require('../models/UserLogin');
const Data = require('../models/Data');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const jwtSecret = process.env.JWT_SECRET;


const Post = require('../models/Post');
const FastData = require('../models/FastData');

// Add body-parser middleware
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.get('',(req, res) =>{
    res.render('index');
});

router.get('/signin',(req, res) =>{
    res.render('signin');
});

router.get('/signup',(req, res) =>{
    res.render('signup');
});

router.get('/dashboard', async (req, res) => {
    try {
        const fastData = await FastData.find().select('date fastTime').exec();
        const data = [['Date', 'Fast Time']];
        fastData.forEach((item) => {
            data.push([new Date(item.date), item.fastTime]);
        });
        res.render('dashboard', { fastData: JSON.stringify(data) });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/tips',(req, res) =>{
    res.render('tips');
});

router.get('/groupchallenge',(req, res) =>{
    res.render('groupchallenge');
});



//**
 /* 
 * Check Login
*/
const authMiddleware = (req, res, next) => {
    const token = req.cookies.token;
  
    if(!token) {
      return res.status(401).json( { message: 'Unauthorized' } );
    }
  
    try {
      const decoded = jwt.verify(token, jwtSecret);
      req.userId = decoded.userId;
      next();
    } catch (error) {
      return res.status(401).json( { message: 'Unauthorized' } );
    }
  
  }

  /**
  * POST /
  * Admin - Register
 */
  router.post('/signup', async (req, res) => {
    try {
      const { fname, lname, email, password, age, gender, health, hours_sleep, stress_level, weight, target_weight, height, body_fat_percentage } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
 
      // Create user
      const user = await UserLogin.create({ fname, lname, email, password: hashedPassword });
 
      // Create data only if user creation was successful
      const newData = new Data({
        email,
        age,
        gender,
        health,
        hours_sleep,
        stress_level,
        weight,
        target_weight,
        height,
        body_fat_percentage
      });
 
      const savedData = await newData.save();
      res.redirect('/signin');
      // Optionally, you can send a response indicating success
      
    } catch (error) {
      if (error.code === 11000) {
        res.status(409).json({ message: 'User already in use' });
      } else {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    }
  });
 

// Handle form submission for fasting data
router.post('/dashboard', authMiddleware, async (req, res) => {
    try {
        // Extract form data from request body
        const { date, startFast, endFast, notes } = req.body;

        // Parse time strings into date objects
        const startTime = new Date(`${date}T${startFast}:00`);
        startTime.setHours(startTime.getHours() -6);
        const endTime = new Date(`${date}T${endFast}:00`);
        endTime.setHours(endTime.getHours() -6);
        const fastTime = (endTime - startTime) / (1000 * 60 * 60);

        // Get the user's email from the session
        const email = req.session.email;

        if (!email) {
            return res.status(401).json({ error: 'User not authenticated' });
        }

        // Create a new instance of the FastData model with the extracted data
        const newFastData = new FastData({
            email,
            date,
            startFast: startTime,
            endFast: endTime,
            fastTime,
            notes
        });

        // Save the instance to the database
        await newFastData.save();

        // Redirect to the dashboard page
        res.redirect('/dashboard');

    } catch (error) {
        // Handle any errors
        console.log(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
  
/**
 * POST /
 * Admin - Check Login
 */
router.post('/signin', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await UserLogin.findOne({ email });

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Store the email in a session
        req.session.email = email;

        res.redirect('/dashboard');

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
  
  });

module.exports = router;
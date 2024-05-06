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

router.get('/dashboard',(req, res) =>{
    res.render('dashboard');
});

router.get('/tips',(req, res) =>{
    res.render('tips');
});

router.get('/groupchallenge',(req, res) =>{
    res.render('groupchallenge');
});

/**
 * 
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

    try {
      const user = await UserLogin.create({ fname, lname, email, password: hashedPassword });
      // res.status(201).json({ message: 'User Created', user });
    } catch (error) {
      if(error.code === 11000) {
        res.status(409).json({ message: 'User already in use' });
      }
      res.status(500).json({ message: 'Internal server error' })
    }

    // Create a new instance of the Data model with the extracted data
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

    // Save the instance to the database
    const savedData = await newData.save();

    // Optionally, you can send a response indicating success
    res.status(201).json({ message: 'User and data created successfully', data: savedData}); //Send response here

  } catch (error) {
    // Handle any errors
    console.log(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }

});

// Handle form submission
router.post('/dashboard', async (req, res) => {
    try {
        
      // Extract form data from request body
      const {date, startFast, endFast, notes} = req.body;
      
      // Parse time strings into date objects
      const startTime = new Date(`${date}T${startFast}:00`);
      startTime.setHours(startTime.getHours() + 6);
      const endTime = new Date(`${date}T${endFast}:00`);
      endTime.setHours(endTime.getHours() +6);
      const fastTime = (endTime - startTime) / (1000 * 60 * 60);
      const email = "zhumingfang3@gmail.com"
  
      // Create a new instance of the UserLogin model with the extracted data
      const newFastData = new FastData({
        email,
        date, 
        startFast: startTime, 
        endFast: endTime, 
        fastTime, 
        notes
      });

  
      // Save the instance to the database
      const savedFastData = await newFastData.save();
  
      // Optionally, you can send a response indicating success
      res.status(201).json({savedFastData}); // Assuming you want to return the saved post data
  
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

    const user = await UserLogin.findOne( { email } );

    if(!user) {
      return res.status(401).json( { message: 'Invalid credentials'} );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if(!isPasswordValid) {
      return res.status(401).json( { message: 'Invalid credentials'} );
    }

    const token = jwt.sign({ userId: user._id}, jwtSecret );
    res.cookie('token', token, { httpOnly: true });

    res.redirect('/dashboard');

  } catch (error) {
    
  }

});


// /**
//  * GET /
//  * Admin Dashboard
//  */
// router.get('/dashboard', authMiddleware, async (req, res) => {
//   res.render('dashboard');


// });

module.exports = router;
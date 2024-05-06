const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const UserLogin = require('../models/UserLogin')
const Data = require('../models/Data')


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


// Handle form submission
router.post('/signup', async (req, res) => {
  try {
    // Extract form data from request body
    const { fname, lname, email, password, age, gender, health, hours_sleep, stress_level, weight, target_weight, body_fat_percentage} = req.body;

    // Create a new instance of the UserLogin model with the extracted data
    const newUserLogin = new UserLogin({
      fname,
      lname,
      email,
      password
    });

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
      body_fat_percentage
    });

    // Save the instance to the database
    const savedData = await newData.save();
    const savedUserLogin = await newUserLogin.save();

    // Optionally, you can send a response indicating success
    res.status(201).json({ user: savedUserLogin, data: savedData}); // Assuming you want to return the saved post data

  } catch (error) {
    // Handle any errors
    console.log(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
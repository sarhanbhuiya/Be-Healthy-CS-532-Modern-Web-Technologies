const express = require('express');
const router = express.Router();

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

module.exports = router;
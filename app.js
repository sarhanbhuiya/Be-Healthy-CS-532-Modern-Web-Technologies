require('dotenv').config();

const express = require('express');
const expressLayout = require('express-ejs-layouts');


const connectDB = require('./server/routes/config/db');

const app = express();
const PORT = 5001 || process.env.PORT;

//Connect to database
connectDB();

app.use(express.static('vendor'));
app.use(express.static('public'));
app.use(express.static('icon'));

//Templating Engine
app.use(expressLayout);
app.set('layout', 'layouts/main');
app.set('view engine','ejs');


app.use('/', require('./server/routes/main'));

app.listen(PORT, () =>{
    console.log(`App is listening on port ${PORT}`);
});
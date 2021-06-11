const express = require('express');
const app = express();
const path = require('path');

app.set('views', path.join(__dirname, 'views'));
app.set('view-engine', 'ejs');


app.get('/login', (req, res) => {
    res.render('login.ejs');
})

app.get('/register', (req, res) => {
    res.render('register.ejs');
})

app.get('/', (req, res) => {
    res.render('index.ejs', {name : 'anonymous'});
})

app.get('*', (req, res) => {
    res.send('invalid PATH request');
})

app.listen(3000, () => {
    console.log('serving on port 3000!!');
})
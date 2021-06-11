const express = require('express');
const app = express();
const path = require('path');

app.set('views', path.join(__dirname, 'views'));
app.set('view-engine', 'ejs');






app.get('/', (req, res) => {
    res.render('index.ejs')
})

app.get('*', (req, res) => {
    res.send('invalid PATH request');
})

app.listen(3000, () => {
    console.log('serving on port 3000!!');
})
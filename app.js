const express = require('express');
const Controller = require('./controllers/controller');
const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }))
app.use(express.json());

app.post('/registration',Controller.registration)
app.post('/login',Controller.login)

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

module.exports = app;
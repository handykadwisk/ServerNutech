require("dotenv").config();
const express = require('express');
const Controller = require('./controllers/controller');
const { authentication } = require('./middlewares/authentication');
const { errHandler } = require('./middlewares/errHandler');
const upload = require('./middlewares/uploader');
const app = express();
const port =process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }))
app.use(express.json());

app.get('/', (req, res)=>{
    res.status(200).json({
        status: 0,
        message: "Hello Word",
        data: null
    });
})
//getbanner routes
app.get('/banner', Controller.getBanner)

//auth routes
app.post('/registration', Controller.registration)
app.post('/login', Controller.login)

//midllewares authentication
app.use(authentication)

//get services route
app.get('/service', Controller.getService)

//profile routes
app.get('/profile', Controller.profile)
app.put('/profile/update', Controller.updateData)
app.put('/profile/image', upload.single('profile_image'), Controller.updateProfileImage)

app.get('/balance',Controller.getBalance)
app.post('/topup',Controller.topup)
app.post('/transaction',Controller.transaction)
app.get('/transaction/history', Controller.history)



app.use(errHandler)
app.listen(port, "0.0.0.0", () => {
    console.log(`Server is running on port ${port}`);
});

module.exports = app;
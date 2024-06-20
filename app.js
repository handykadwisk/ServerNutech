const express = require('express');
const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }))
app.use(express.json());

app.get('/', async(req, res)=>{
    try {
        res.status(200).json({message:'hello word'})
    } catch (error) {
        console.log(error.message);
    }
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

module.exports = app;
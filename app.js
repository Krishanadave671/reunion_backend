const express = require('express'); 
const mongoose = require('mongoose'); 
const dotenv = require('dotenv');
dotenv.config(); 
const authrouter = require('./routes/auth');
const postrouter = require('./routes/post');
const userrouter = require('./routes/user');

const port = process.env.PORT || 3000;
const app = express();

const DB = process.env.MONGO_URI ; 
app.use(express.json()); 
app.use(authrouter); 
app.use(userrouter); 
app.use(postrouter); 

mongoose.connect(DB).then(() => {
    console.log("connection successful");
}).catch((e) => {
    console.log("Error : " , e);
})

// testing the server
app.get("/" , (req, res) => { 
    res.send("Hello world !")
  })

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});


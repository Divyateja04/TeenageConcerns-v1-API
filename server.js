const express = require('express');
const cors = require('cors');
const knex = require('knex');
const bcrypt = require('bcrypt-nodejs');

//User Defined Endpoints
const user = require('./endpoints/user');
const volunteer = require('./endpoints/volunteer');

//User Defined Constants
const PORT = process.env.PORT || 3000;

const app = express();

const db= knex({
    client: 'pg',
    connection: {
      host : '127.0.0.1', //localhost
      user : 'postgres', //add your user name for the database here
      port: 5432, // add your port number here
      password : 'admin', //add your correct password in here
      database : 'teenageconcerns' //add your database name you created here
    }
});

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
    console.log("Backend Server is up and running!")
    res.json("Success!")
})

//User Register - POST - Used to submit form details to the backend server
app.post("/user/register", user.handleUserRegister(db))

//Find Advisor for user - GET - Used to submit ID and get advisor details
app.get("/findadvisor/:id", user.getAdvisor(db));

//Delete User Data - DEL - Used to delete user data 
app.delete("/user/delete/:id", user.handleUserDelete(db));

//Volunteer Registration - POST - Used to register volunteers
app.post("/volunteer/register", volunteer.handleVolunReg(db, bcrypt))

//Volunteer Login - POST - Enter email/password and submit
app.post("/volunteer/login", volunteer.handleVolunLogin(db, bcrypt))

app.listen(PORT, () => {
    console.log("Server running on", PORT);
})

/* 
DONE / - GET - Nothing at the moment

DONE /user/register - POST - will send the submitted responses to a database with an ID
(ID should be generated in the front end itself, maybe some random 7digit number)
DONE /user/delete/:id - DEL - removes the data from the database of users

DONE /findadvisor/:id - GET - we take ID and then get him/her an advisor

DONE /volunteer/register - POST - Registration for volunteers
DONE /volunteer/login - POST - /login for volunteers(Only login part)
*/
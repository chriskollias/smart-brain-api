const express = require("express");
const bcrypt = require("bcrypt-nodejs");
const cors = require("cors");
const knex = require("knex");

const register = require("./controllers/register");
const signin = require("./controllers/signin");
const profile = require("./controllers/profile");
const image = require("./controllers/image");

// setup database connection
const db = knex({
	client: "pg",
	connection: {
		host: "127.0.0.1",
		user: "chris",
		password: "testing123",
		database: "smart-brain"
	}
});

// initialize express
const app = express();

// setup middlewares
app.use(express.json());
app.use(cors())

/*
		API PLAN

		/ 			  GET, responds w/ all user profiles
		/signin		POST, responds with success or failure
		/register	POST, responds w/ newly created user info
		/profile/:userId	GET, userId is optional parameter, responds w/ user(s) info
		/image		PUT, updates a user's score/ranking stuff, returns updated user info 

*/

app.get("/", (req, res) => {
	res.send({});
})

app.post("/signin", (req, res) => {signin.handleSignIn(req, res, db, bcrypt)});

// this works the same as the arrow function in the above example, handleRegister will receive (req, res) after it receives (db, bcrypt), but you need like a second arrow to grab them. Look at register.js to see how it works.
app.post("/register", register.handleRegister(db, bcrypt))

// id is an optional parameter, if provided it shows up in req.params
app.get("/profile/:id", (req, res) => {profile.handleProfileGet(req, res, db)});

app.put("/image", (req, res) => {image.handleImage(req, res, db)});

app.post("/imageurl", (req, res) => {image.handleAPICall(req, res)});

// start server on port 3000, second arg is function that runs right after it starts listening
app.listen(3000, () => {
	console.log("App is running on port 3000.");
});


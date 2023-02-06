const handleRegister = (db, bcrypt) => (req, res) => {
	// use destructuring to grab fields out of the request body
	const { email, name, password } = req.body;

	// validate the data sent from frontend
	if (!email || !name || !password) {
		// returning here just to exit func
		return res.status(400).json('incorrect form submission');
	}

	const hash = bcrypt.hashSync(password);
	db.transaction(trx => {
		trx.insert({
			hash: hash,
			email: email
		})
		.into('login')
		.returning('email')
		.then(loginEmail => {
			trx('users')
			.returning('*')
			.insert({
				email: loginEmail[0].email,
				name: name,
				joined: new Date()
			})
			.then(userData => {
				// it returns the newly added user's data inside an array, we just want the user data directly, so we return the 0th element
				res.json(userData[0]);
			})
		})
		.then(trx.commit)
		.catch(trx.rollback)
	})
	.catch(err => res.status(400).json("Unable to register"))
}

module.exports = {
    handleRegister: handleRegister
};

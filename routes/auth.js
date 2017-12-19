const wrap = require('express-async-wrap');
const UserService = require('../services/UserService');

module.exports = router => {

	// register new user
	router.post('/api/register', wrap(async (req, res) => {
		let newUser = await UserService.registerNewUser(req.body.username, req.body.password,
			req.body.nativeLanguage, req.body.targetLanguage);
		if(!newUser) {
			res.status(400).send();
		} else {
			res.status(201).send(newUser.id);
		}
	}));

	// delete the current user
	router.post('/api/unregister', wrap(async (req, res) => {
		let success = await UserService.deleteAccount(req.session.userId);
		if(!success){
			res.status(404).send();
		} else {
			res.status(204).send();
		}
	}));

	// log in
	router.post('/api/login', wrap(async (req, res) => {
		let user = await UserService.login(req.body.username, req.body.password);
		if(!user){
			res.status(401).send();
		} else {
			req.session.userId = user.id;
			res.json(user);
		}
	}));

	// log out the current user
	router.post('/api/logout', wrap(async (req, res) => {
		req.session = null;
		res.status(204).send();
	}));

};
const wrap = require('express-async-wrap');
const UserService = require('../services/UserService');

module.exports = router => { 

	// get information about the given user
	router.get('/api/user/:id', wrap(async (req, res) => {
		let user = await UserService.getUserInfo(req.params.id, req.session.userId);
		if(!user){
			res.status(404).send();
		} else {
			res.json(user);
		}
	}));

	// get statistics of the given user
	router.get('/api/user/:id/stats', wrap(async (req, res) => {
		let stats = await UserService.getUserStats(req.params.id);
		if(!stats){
			res.status(404).send();
		} else {
			res.json(stats);
		}
	}));

};
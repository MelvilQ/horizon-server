const wrap = require('express-async-wrap');
const TextService = require('../services/TextService');

module.exports = router => {
	
	// list all collections of the current user
	router.get('/api/collections', wrap(async (req, res) => {
		let collections = await TextService.listCollections(req.session.userId);
		if(!collections){
			res.status(404).send();
		} else {
			res.json(collections);
		}
	}));

};
const wrap = require('express-async-wrap');
const WordService = require('../services/WordService');

module.exports = router => {

	// get saved words of the current user for the given language
	router.get('/api/words/:languageId', wrap (async (req, res) => {
		let words = await WordService.getWordList(req.session.userId, req.params.languageId);
		if(!words){
			res.status(400).send();
		} else {
			res.json(words);
		}
	}));
	
	// set strength of a word
	router.put('/api/word/strength', wrap(async (req, res) => {
		let updateStrength = await WordService.setStrength(req.body.userId, req.body.languageId, 
			req.body.word, req.body.strength);
		if(!updateStrength){
			res.status(400).send();
		} else if(typeof updateStrength === 'object'){
			res.status(201).send();
		} else {
			res.status(204).send(); 
		}
	}));
	
	// set meaning of a word
	router.put('/api/word/meaning', wrap(async (req, res) => {
		let updateMeaning = await WordService.setMeaning(req.body.userId, req.body.languageId, 
			req.body.word, req.body.meaning);
		if(!updateMeaning){
			res.status(400).send();
		} else if(typeof updateMeaning === 'object'){
			res.status(201).send();
		} else {
			res.status(204).send(); 
		}
	}));
};
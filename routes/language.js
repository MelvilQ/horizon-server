const wrap = require('express-async-wrap');
const LanguageService = require('../services/LanguageService');

module.exports = router => {

	// list all languages
	router.get('/api/languages', wrap(async (req, res) => {
		const languages = await LanguageService.getAllLanguages();
		if(!languages){
			res.status(404).send();
		} else {
			res.json(languages);
		}
	}));

	// get information about a specific language
	router.get('/api/language/:id', wrap(async (req, res) => {
		const language = await LanguageService.getLanguage(req.params.id);
		if(!language){
			res.status(404).send();
		} else {
			res.json(language);
		}
	}));

};
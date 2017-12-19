const models = require('../models');

class LanguageService {

	static async getAllLanguages(){
		return await models.Language.findAll();
	}

	static async getLanguage(id){
		return await models.Language.findById(id);
	}
}

module.exports = LanguageService;
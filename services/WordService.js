const _ = require('lodash');
const models = require('../models');

class WordService {

	static async getWordList(userId, languageId){
		return await models.Word.findAll({
			attributes: ['word', 'strength', 'meaning'],
			where: {userId, languageId}
		});
	}

	static async setStrength(userId, languageId, word, strength){
		if(!userId || !languageId || !word || !strength){
			return null;
		}
		let wordEntry = await models.Word.findOne({where: {word, userId, languageId}});
		if(!wordEntry){
			try {
				let newEntry = await models.Word.create({word, strength, userId, languageId});
				return newEntry;
			} catch (e) {
				return null;
			}
		} else {
			wordEntry.strength = strength;
			if(strength === -1) {
				wordEntry.meaning = null;
			}
			await wordEntry.save();
			return strength;
		}
	}

	static async setMeaning(userId, languageId, word, meaning){
		if(!userId || !languageId || !word || !meaning){
			return false;
		}
		let wordEntry = await models.Word.findOne({where: {word, userId, languageId}});
		if(!wordEntry){
			try {
				let newEntry = await models.Word.create({
					word, strength: 1, meaning, userId,	languageId
				});
				return newEntry;
			} catch (e) {
				return null;
			}
		} else {
			wordEntry.meaning = meaning;
			await wordEntry.save();
			return meaning;
		}
	}

}

module.exports = WordService;
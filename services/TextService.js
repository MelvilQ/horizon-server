const _ = require('lodash');
const models = require('../models');
const {Op, fn, col, literal} = models.Sequelize;
const TextPiecesConverter = require('./TextPiecesConverter');

class TextService {

	static async createText(userId, languageId, title, raw){
		if(!userId || !languageId || !title || !raw){
			return null;
		}
		let pieces = TextPiecesConverter.convertTextToPieces(raw);
		let wordList = TextPiecesConverter.extractWordListFromPieces(pieces);
		try {
			let createdText = await models.Text.create({
				userId, languageId, title, raw,
				pieces: JSON.stringify(pieces),
				wordList: '|' + wordList.join('|') + '|'
			});
			return createdText;
		} catch (e) {
			return null;
		}
	}

	static async listCollections(userId){
		return await models.Text.findAll({
			attributes: [['collection', 'name'], [fn('count', col('collection')), 'numTexts']],
			group: ['collection'],
			where: {userId},
			order: [[literal('numTexts'), 'DESC']]
		});
	}

	static async listTexts(userId, query){
		if(query.word){
			query.wordList = {[Op.like]: '%|' + query.word + '|%'};
		}
		query = _.pick(query, ['languageId', 'collection', 'wordList']);
		query.userId = userId;
		let texts = await models.Text.findAll({where: query});
		if(!texts){
			return null;
		}
		return texts.map(text => _.pick(text, ['id', 'title']));
	}

	static async openText(textId, userId){
		let text = await models.Text.findById(textId);
		if(!text || text.userId !== userId) {
			return null;
		}
		let json = await TextService.getJsonStringForText(text);
		models.User.update( // intentionally not awaited
			{lastOpenedTextId: text.id, activeLanguage: text.languageId}, 
			{where: {id: text.userId}}
		); 
		return json;
	}

	static async getJsonStringForText(text){
		let wordListStr = text.wordList;
		let wordList = wordListStr.substring(1, wordListStr.length - 1).split('|');
		let words = await models.Word.findAll({where: {word: wordList}});
		let strength = {};
		let meaning = {};
		for(let i = 0; i < words.length; ++i){
			let word = words[i];
			if(word.strength){
				strength[word.word] = word.strength;
			}
			if(word.meaning){
				meaning[word.word] = word.meaning;
			}
		}
		let json = '{';
		json += '"pieces":' + text.pieces + ',';
		json += '"strength":' + JSON.stringify(strength) + ',';
		json += '"meaning":' + JSON.stringify(meaning) + '}';
		return json;
	}

	static async getRawText(textId, userId){
		let text = await models.Text.findById(textId);
		if(!text || text.userId !== userId){
			return null;
		} else {
			return text.raw;
		}
	}

	static async getWordList(textId, userId){
		let text = await models.Text.findById(textId);
		if(!text || text.userId !== userId){
			return null;
		} else {
			return text.wordList.substring(1, text.wordList.length - 1).split('|');
		}
	}

	static async addTextToCollection(textId, collection, userId){
		let [affectedCount] = await models.Text.update(
			{collection}, 
			{where: {id: textId, userId}}
		);
		return (affectedCount > 0);
	}

	static async editText(textId, newText, userId){
		if(!textId || !newText || !userId){
			return false;
		}
		let text = await models.Text.findById(textId);
		if(!text || text.userId !== userId){
			return false;
		}
		let pieces = TextPiecesConverter.convertTextToPieces(newText);
		let wordList = TextPiecesConverter.extractWordListFromPieces(pieces);
		text.raw = newText;
		text.pieces = JSON.stringify(pieces),
		text.wordList = '|' + wordList.join('|') + '|';
		await text.save();
		return true;
	}

	static async deleteText(textId, userId){
		let text = await models.Text.findById(textId);
		if(!text || text.userId !== userId){
			return false;
		} 
		await text.destroy();
		return true;
	}

}

module.exports = TextService;
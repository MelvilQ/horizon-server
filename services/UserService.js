const bcrypt = require('bcrypt-then');
const randomstring = require('randomstring');
const _ = require('lodash');

const models = require('../models');
const {fn, col} = models.Sequelize;

class UserService {

	static async registerNewUser(name, password, nativeLanguageId, targetLanguageId){
		if (!name || !password || !nativeLanguageId || !targetLanguageId){
			return null;
		}
		let passwordSalt = randomstring.generate(16);
		let passwordHash = await bcrypt.hash(password);
		try {
			let newUser = await models.User.create({
				name, passwordHash, passwordSalt, nativeLanguageId,	
				targetLanguageIds: [targetLanguageId]
			});
			return newUser;
		} catch (e) {
			return null;
		}
	}

	static async deleteAccount(userId){
		let user = await models.User.findById(userId);
		if(!user){
			return false;
		}
		await user.destroy();
		return true;
	}

	static async login(username, password){
		if(!username || !password){
			return null;
		}
		let user = await models.User.findOne({where: {name: username}});
		if(!user){
			return null;
		}
		let valid = await bcrypt.compare(password, user.passwordHash);
		if(!valid){
			return null;
		}
		return _.pick(user, 
			['id', 'name', 'lastOpenedTextId', 'activeLanguageId', 'nativeLanguageId']
		);
	}

	static async getUserInfo(userId, loggedInUserId){
		let user = await models.User.findById(userId);
		if(!user){
			return null;
		}
		let fields = ['id', 'name', 'nativeLanguageId', 'activeLanguageId'];
		console.log(userId + ' ' + loggedInUserId);
		if(userId == loggedInUserId){
			fields.push('lastOpenedTextId');
		}
		return _.pick(user, fields);
	}

	static async getUserStats(userId){
		let languages = await models.Word.findAll({
			where: {userId},
			attributes: ['languageId'],
			distinct: true
		});
		languages = languages.map(w => w.languageId);

		let stats = {};

		for (const languageId of languages) {
			let languageStats = await models.Word.findAll({
				attributes: ['strength', [fn('count', col('strength')), 'numWords']],
				group: ['strength'],
				where: {userId, languageId}
			});
			languageStats = languageStats.map(s => s.dataValues).reduce(
				(obj, strengthCount) => {
					obj[strengthCount.strength] = strengthCount.numWords;
					return obj;
				}, 
				{}
			);
			languageStats.score = this.getScoreFromStats(languageStats);
			languageStats.level = this.getLevelFromScore(languageStats.score);
			stats[languageId] = languageStats;
		}

		return stats;
	}

	static getScoreFromStats(languageStats){
		let score = 0;
		if ('4' in languageStats) {
			score += 10 * languageStats['4'];
		}
		if ('3' in languageStats) {
			score += 6 * languageStats['3'];
		}
		if ('2' in languageStats) {
			score += 3 * languageStats['2'];
		}
		if ('1' in languageStats) {
			score += 1 * languageStats['1'];
		}
		return score;
	}

	static getLevelFromScore(score){
		// sequence: 100, 350, 750, 1300, 2000, 2850, 3850, 5000, 6300, ... 
		let level = 0;
		let demand = 100;
		while(score >= 0) {
			score -= demand;
			demand += 150;
			level += 1;
		}
		return level; 
	}

}

module.exports = UserService;
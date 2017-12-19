const uuid = require('uuid/v4');
const fileType = require('file-type');
const fs = require('fs-extra');
const models = require('../models');
const settings = require('../settings');

class FileService {

	static async processAudioUpload(textId, userId, audioFile){
		let text = await models.Text.findById(textId);
		if(!text || text.userId !== userId) {
			return false;
		}
		var uploadedFileInfo = fileType(audioFile);
		if(!uploadedFileInfo || uploadedFileInfo.ext !== 'mp3' || uploadedFileInfo.mime !== 'audio/mpeg'){
			return false;
		}
		let audioFileName = uuid() + '.mp3';
		let audioFilePath = settings.audioFolder + audioFileName;
		try {
			await fs.writeFile(audioFilePath, audioFile);
			text.audio = audioFileName;
			await text.save();
		} catch(e) {
			return false;
		}
		return true;		
	}

	static async getAudioFilePath(textId, userId){
		let text = await models.Text.findById(textId);
		if(!text || text.userId !== userId || !text.audio) {
			return null;
		}
		return settings.audioFolder + text.audio;
	}

	static async deleteAudio(textId, userId){
		let text = await models.Text.findById(textId);
		if(!text || text.userId !== userId) {
			return false;
		}
		let audioFilePath = settings.audioFolder + text.audio;
		try {
			await fs.unlink(audioFilePath);
			text.audio = null;
			await text.save();
		} catch(e) {
			return false;
		}
		return true;
	}

}

module.exports =  FileService;
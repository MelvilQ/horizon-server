const wrap = require('express-async-wrap');
const TextService = require('../services/TextService');
const FileService = require('../services/FileService');

module.exports = router => {
	
	// list all texts of the current user that match the given query
	router.get('/api/texts', wrap(async (req, res) => {
		let textList = await TextService.listTexts(req.session.userId, req.query);
		if(!textList){
			res.status(404).send();
		} else {
			res.json(textList);
		}
	}));

	// get json representation of a text ("pieces")
	router.get('/api/text/:id', wrap(async (req, res) => {
		let json = await TextService.openText(req.params.id, req.session.userId);
		if(!json){
			res.status(404).send();
		} else {
			res.status(200).contentType('json').send(json);
		}
	}));

	// get raw text
	router.get('/api/text/:id/raw', wrap(async (req, res) => {
		let raw = await TextService.getRawText(req.params.id, req.session.userId);
		if(!raw){
			res.status(404).send();
		} else {
			res.status(200).contentType('txt').send(raw);
		}
	}));

	// list of words for a text
	router.get('/api/text/:id/words', wrap(async (req, res) => {
		let wordList = await TextService.getWordList(req.params.id, req.session.userId);
		if(!wordList){
			res.status(404).send();
		} else {
			res.json(wordList);
		}
	}));

	// upload text
	router.post('/api/text', wrap(async (req, res) => {
		let text = await TextService.createText(req.session.userId, req.body.languageId, 
			req.body.title, req.body.text);
		if(!text){
			res.status(400).send();
		} else {
			res.json(text.id);
		}
	}));

	// assign the given text into a collection
	router.put('/api/text/:id/collection', wrap(async (req, res) => {
		let success = await TextService.addTextToCollection(req.params.id, req.body.collection, 
			req.session.userId);
		if(!success){
			res.status(400).send();
		} else {
			res.status(204).send();
		}
	}));

	// alter the given text
	router.put('/api/text/:id', wrap(async (req, res) => {
		let success = await TextService.editText(req.params.id, req.body.text, req.session.userId);
		if(!success){
			res.status(400).send();
		} else {
			res.status(204).send();
		}
	}));

	// delete the given text
	router.delete('/api/text/:id', wrap(async (req, res) => {
		let success = await TextService.deleteText(req.params.id, req.session.userId);
		if(!success){
			res.status(400).send();
		} else {
			res.status(204).send();
		}
	}));

	// upload audio file for the given text
	router.put('/api/text/:id/audio', wrap(async (req, res) => {
		let success = await FileService.processAudioUpload(req.params.id, req.session.userId, req.body);
		if(!success){
			res.status(400).send();
		} else {
			res.status(204).send();
		}
	}));

	// serve audio file
	router.get('/api/text/:id/audio', wrap(async (req, res) => {
		let audioFilePath = await FileService.getAudioFilePath(req.params.id, req.session.userId);
		if(!audioFilePath){
			res.status(404).send();
		} else {
			res.sendFile(audioFilePath);
		}
	}));

	// remove audio file
	router.delete('/api/text/:id/audio', wrap(async (req, res) => {
		let success = await FileService.deleteAudio(req.params.id, req.session.userId);
		if(!success){
			res.status(400).send();
		} else {
			res.status(204).send();
		}
	}));

};
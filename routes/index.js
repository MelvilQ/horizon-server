const express = require('express');
const fs = require('fs-extra');
const path = require('path');

const router = express.Router();

fs.readdirSync(__dirname)
	.filter(file => (file.indexOf('.') !== 0) && (file !== 'index.js'))
	.forEach(file => require(path.join(__dirname, file))(router));

module.exports = router;
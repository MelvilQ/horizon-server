const fs = require('fs-extra');
const path = require('path');

const Sequelize = require('sequelize');
const sequelize = new Sequelize('horizon', 'horizon', 'horizon', {
	host:'localhost',
	port:'3306',
	dialect: 'mysql',
	timestamps: false
});

let db = {};

fs.readdirSync(__dirname)
	.filter(file => (file.indexOf('.') !== 0) && (file !== 'index.js'))
	.forEach(file => {
		const model = sequelize.import(path.join(__dirname, file));
		db[model.name] = model;
	});
	
Object.keys(db).forEach(modelName => {
	if ('associate' in db[modelName]) {
		db[modelName].associate(db);
	}
});

db.Sequelize = Sequelize;
db.sequelize = sequelize;

module.exports = db;
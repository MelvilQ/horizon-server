const express = require('express');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');

const routes = require('./routes');

const models = require('./models');
const TextService = require('./services/TextService');
const UserService = require('./services/UserService');

const loginChecker = require('./middleware/loginChecker');
const logger = require('./middleware/logger');

const app = express();
app.use(bodyParser.json({limit: '1mb'}));
app.use(bodyParser.raw({limit: '32mb', type: 'audio/mpeg'}));
app.use(cookieSession({
	secret: 'I am secret',
	maxAge: 7 * 24 * 60 * 60 * 1000
}));
app.use(loginChecker());
app.use(logger());
app.use(routes);

models.sequelize.sync({force: true}).then(async () => {
	const de = await models.Language.create({name: 'Deutsch', code: 'de'});
	const fr = await models.Language.create({name: 'Français', code: 'fr'});
	const melvil = await UserService.registerNewUser('MelvilQ', 'aaaabbbb', de.id, fr.id);
	await TextService.createText(melvil.id, fr.id, 'Le Petit Prince', 
		`Honni soit qui mal y pense, dit le petit prince.
		Je suis très petit et j'ai mal à écrire quelque chose de normal.\n\nOh là là...`);

	console.log('READY TO GO!');
});

app.listen(3000, () => console.log('Horizon server listening on port 3000'));

module.exports.app = app;
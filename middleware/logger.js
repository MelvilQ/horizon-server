module.exports = () => (req, res, next) => {
	if(req.header('content-type') === 'application/json'){
		console.log(req.method + ' ' + req.path + ' ' + JSON.stringify(req.body));
	} else {
		console.log(req.method + ' ' + req.path);
	}
	next();
};
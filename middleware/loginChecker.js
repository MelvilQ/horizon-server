module.exports = () => (req, res, next) => {
	if(req.path === '/api/register' || req.path === '/api/login'){
		next();	// register and login does not require a session
	} else if(!req.session.userId){
		res.status(401).send('not logged in');	// nice try^^
	} else {
		next();	// session is verified
	}
};
'use strict'

const typeChecker = (req, res, next) => {
	if (typeof (req.body.pages) == "number" &&
		req.body.pages > 0 &&
		req.body.pages < 6) next();
	else res.send('Page argument must be a number between 1 and 5');
};

module.exports = typeChecker;
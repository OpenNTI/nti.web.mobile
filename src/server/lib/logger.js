var morgan = require('morgan');//defines a 'default' prop... breaks if "import morgan from 'morgan'" is used.

const loguser = morgan['remote-user'];

export default Object.assign(morgan, {

	['remote-user']: req => {
		var u = loguser(req);
		if ((!u || u === '-') && req.username) {
			u = req.username;
		}
		return u;
	},

	attachToExpress: expressApp => {
		expressApp.use(require('response-time')());
		expressApp.use(require('cookie-parser')());
		expressApp.use(morgan('combined'));
	}

});

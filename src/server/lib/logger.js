import morgan from 'morgan';
import responseTime from 'response-time';
import cookieParser from 'cookie-parser';

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
		expressApp.use(responseTime());
		expressApp.use(cookieParser());
		expressApp.use(morgan('combined'));
	}

});

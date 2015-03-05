import morgan from 'morgan';
import responseTime from 'response-time';
import cookieParser from 'cookie-parser';

import logger from 'dataserverinterface/logger';

export default Object.assign(morgan, {

	attachToExpress: expressApp => {
		expressApp.use(responseTime());
		expressApp.use(cookieParser());
		expressApp.use(morgan('- - [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"'));
	},


	info () {
		logger.info(...arguments);
	},


	error () {
		logger.error(...arguments);
	}

});

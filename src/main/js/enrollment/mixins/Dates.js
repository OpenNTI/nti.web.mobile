import moment from 'moment';

export default {
	getDate (date) {
		let m = moment(new Date(date));

		return m.format('LL');
	}
};

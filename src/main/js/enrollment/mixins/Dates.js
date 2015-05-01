import moment from 'moment';

export default {
	getDate (date) {
		return date && moment(new Date(date)).format('LL');
	}
};

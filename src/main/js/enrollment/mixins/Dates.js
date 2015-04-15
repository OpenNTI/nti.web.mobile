

var moment = require('moment');

module.exports = {
	getDate: function(date) {
		var d = new Date(date);
		var m = moment(d);

		return m.format('LL');
	}
};


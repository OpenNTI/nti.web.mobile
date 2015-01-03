'use strict';

//var Actions = require('../../Actions');

module.exports = {

	statics: {
		handles: function(item) {
			if (!this.__typeCleaned) {
				//ensure data type:
				if (!Array.isArray(this.type)) {
					this.type = [this.type];
				}
				//ensure shape:
				this.type.forEach(function(s,i,a){a[i]=s.toLowerCase();});

				//prevent re-entry:
				this.__typeCleaned = true;
			}

			//Perform actual test...
			return this.__test(item);

		},


		__test: function (item) {
			var type = item.MimeType
							.replace('application/vnd.nextthought.', '')
							.toLowerCase();
			return (this.type.indexOf(type) !== -1);
		}
	}
};

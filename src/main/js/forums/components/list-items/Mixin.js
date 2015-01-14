'use strict';

var isType = require('common/Utils').isMimeType;

module.exports = {

	statics: {
		handles: function(item) {
			if (!this.__typeCleaned) {
				//ensure data type:
				if (!Array.isArray(this.inputType)) {
					this.inputType = [this.inputType];
				}
				//ensure shape:
				this.inputType.forEach(function(s,i,a){a[i]=s.toLowerCase();});

				//prevent re-entry:
				this.__typeCleaned = true;
			}

			//Perform actual test...
			return this.__test(item);

		},

		__test: function (item) {
			return isType(item, this.inputType);
		}

	}
};

'use strict';

module.exports = {

	statics: {
		handles: function(item) {
			if (!this.__inputTypeCleaned) {
				//ensure data type:
				if (!Array.isArray(this.inputType)) {
					this.inputType = [this.inputType];
				}
				//ensure shape:
				this.inputType.forEach(function(s,i,a){a[i]=s.toLowerCase();});

				//prevent re-entry:
				this.__inputTypeCleaned = true;
			}

			//Perform actual test...
			return this.__test(item);

		},


		__test: function (item) {
			var type = item.MimeType
				.replace('application/vnd.nextthought.assessment.', '')
				.replace(/part$/i, '')
				.toLowerCase();
			return (this.inputType.indexOf(type) !== -1);
		}
	}

};

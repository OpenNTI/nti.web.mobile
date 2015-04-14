import {isMimeType} from 'common/utils/mimetype';

const CLEANED = Symbol('Type has been cleaned');

export default {

	statics: {
		handles (item) {
			if (!this[CLEANED]) {
				//ensure data type:
				if (!Array.isArray(this.inputType)) {
					this.inputType = [this.inputType];
				}

				//ensure shape:
				this.inputType.forEach((s, i, a) => a[i] = s.toLowerCase());

				//prevent re-entry:
				this[CLEANED] = true;
			}

			//Perform actual test...
			return isMimeType(item, this.inputType);
		}

	}
};

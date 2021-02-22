import { String as StringUtils } from '@nti/lib-commons';

const inputTypeCleaned = Symbol();

export default {
	statics: {
		handles(item) {
			if (!this[inputTypeCleaned]) {
				//ensure event type:
				if (!Array.isArray(this.mimeType)) {
					this.mimeType = [this.mimeType];
				}
				//ensure shape:
				this.mimeType.forEach(
					(s, i, a) =>
						(a[i] = s.test
							? s
							: new RegExp(StringUtils.escapeForRegExp(s), 'i'))
				);

				//prevent re-entry:
				this[inputTypeCleaned] = true;
			}

			//Perform actual test...
			return this.testType(item);
		},

		testType(item) {
			let mimeType = item && item.MimeType;
			return this.mimeType.some(x => x.test(mimeType));
		},
	},
};

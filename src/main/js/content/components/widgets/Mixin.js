import {String as StringUtils} from 'nti-commons';

function toRegExpStr (s) {
	return StringUtils.escapeForRegExp(s.replace(/^application\/vnd\.nextthought\./, ''));
}

export default {
	statics: {

		handles (item) {
			let re = this.itemType;

			if (Array.isArray(re)) {
				re = re.map(toRegExpStr);
				re = new RegExp('(' + re.join('|') + ')', 'i');
			}

			else if (typeof re === 'string') {
				re = new RegExp(toRegExpStr(re), 'i');
			}

			return [item.type, item.class, item.MimeType, item.Class].some(x=>re.test(x));
		}
	}
};

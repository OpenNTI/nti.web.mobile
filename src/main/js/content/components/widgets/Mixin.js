
import escape from 'nti.lib.interfaces/utils/regexp-escape';

function toRegExpStr (s) {
	return escape(s.replace(/^application\/vnd\.nextthought\./, ''));
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

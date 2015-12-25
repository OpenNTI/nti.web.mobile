import selectWidget from './widgets/';
import ensureArray from 'nti.lib.interfaces/lib/utils/ensure-array';

export default {
	renderItems (items, props) {
		let widgets = ensureArray(items).map((item, index) => {
			return selectWidget(item, index, props);
		});
		return widgets;
	}
};

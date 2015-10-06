import ensureIterable from 'nti.lib.interfaces/utils/ensure-iterable';

import selectWidget from './components/widgets';

export default {

	renderItems (items, props) {
		let widgets = ensureIterable(items).map((item, index) => {
			return selectWidget(item, index, props);
		});
		return widgets;
	}
};

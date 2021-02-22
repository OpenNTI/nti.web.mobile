import { Array as ArrayUtils } from '@nti/lib-commons';

import selectWidget from './widgets/';

export default {
	renderItems(items, props) {
		let widgets = ArrayUtils.ensure(items).map((item, index) => {
			return selectWidget(item, index, props);
		});
		return widgets;
	},
};

import selectWidget from './widgets/';
import {Array as ArrayUtils} from 'nti-commons';

export default {
	renderItems (items, props) {
		let widgets = ArrayUtils.ensure(items).map((item, index) => {
			return selectWidget(item, index, props);
		});
		return widgets;
	}
};

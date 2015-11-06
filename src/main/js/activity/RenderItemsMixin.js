import selectWidget from './components/widgets';

export default {

	renderItems (items, props) {

		const o = !items
			? null
			: items.map
				? items : [items];

		return o && o.map((item, index) => {
			let out;

			if (this.selectWidget) {
				out = this.selectWidget(item, index, props);
			}

			return out || selectWidget(item, index, props);
		});
	}
};

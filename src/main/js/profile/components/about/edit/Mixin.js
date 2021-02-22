import PropTypes from 'prop-types';
import { v4 as uuid } from 'uuid';

export default {
	propTypes: {
		items: PropTypes.array,
		field: PropTypes.string,
	},

	componentDidMount() {
		this.initItems();
	},

	componentDidUpdate(prevProps) {
		if (prevProps.items !== this.props.items) {
			this.initItems();
		}
	},

	initItems(props = this.props) {
		let { items } = props;

		if (items) {
			//deep clone
			items = items.map(x => JSON.parse(JSON.stringify(x)));
		}

		this.setState({ items });
	},

	addEntry() {
		let { items } = this.state || {};
		items = items ? items.slice() : [];

		items.push({
			id: uuid(),
		});

		this.setState({ items });
	},

	removeEntry(index) {
		let { items } = this.state || {};
		items = items ? items.slice() : [];

		items.splice(index, 1);
		this.setState({ items });
	},

	getValue() {
		let { items } = this.state;
		let value = [];

		if (this.itemsArePrimitive) {
			value = items || [];
		} else {
			for (let item of Object.values(this.eventItems)) {
				if ((item || {}).getValue) {
					value.push(item.getValue());
				}
			}
		}

		value = value.filter(x => x);

		if (value.length === 0) {
			value = null;
		}

		return { [this.props.field]: value };
	},
};

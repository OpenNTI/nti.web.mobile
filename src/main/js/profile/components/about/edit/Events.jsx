import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';

import AddEntryButton from './AddEntryButton';
import EventItem from './EventItem';
import Mixin from './Mixin';
import RemoveIcon from './RemoveIcon';

export default createReactClass({
	displayName: 'Events:Edit',
	mixins: [Mixin],

	propTypes: {
		items: PropTypes.array,

		field: PropTypes.string.isRequired,

		schema: PropTypes.object.isRequired,

		mimeType: PropTypes.string.isRequired,

		fieldNames: PropTypes.arrayOf(PropTypes.string).isRequired,
	},

	getRefCallback(index) {
		const key = `ref-cb-${index}`;
		return (
			this[key] ||
			(this[key] = x => (this.eventItems[`item-${index}`] = x))
		);
	},

	componentDidMount() {
		this.eventItems = {};
	},

	validate() {
		const errors = [];
		const { items = [] } = this.state || {};
		for (let i = 0; i < items.length; i++) {
			const item = this.eventItems[`item-${i}`];
			if (item && item.validate && !item.validate()) {
				errors.push(item);
			}
		}
		return errors.length === 0;
	},

	remove(index) {
		this.removeEntry(index);
	},

	render() {
		let { mimeType, fieldNames, field, schema } = this.props;
		let { items } = this.state || {};

		let { itemSchema } = schema[field] || {};

		return (
			<div>
				{(items || []).map((item, index) => {
					return (
						<div className="entry" key={`item-${index}`}>
							<RemoveIcon onClick={this.remove} index={index} />
							<EventItem
								schema={itemSchema}
								item={item}
								ref={this.getRefCallback(index)}
								mimeType={mimeType}
								fieldNames={fieldNames}
							/>
						</div>
					);
				})}
				<div className="controls buttons">
					<AddEntryButton onClick={this.addEntry} />
				</div>
			</div>
		);
	},
});

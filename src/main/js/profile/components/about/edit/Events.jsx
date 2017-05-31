import React from 'react';
import createReactClass from 'create-react-class';
import AddEntryButton from './AddEntryButton';
import EventItem from './EventItem';
import Mixin from './Mixin';
import RemoveIcon from './RemoveIcon';

export default createReactClass({
	displayName: 'Events:Edit',
	mixins: [Mixin],

	propTypes: {
		items: React.PropTypes.array,

		field: React.PropTypes.string.isRequired,

		schema: React.PropTypes.object.isRequired,

		mimeType: React.PropTypes.string.isRequired,

		fieldNames: React.PropTypes.arrayOf(React.PropTypes.string).isRequired
	},

	getRefCallback (index) {
		const key = `ref-cb-${index}`;
		return this[key] || (this[key] = x => this.eventItems[`item-${index}`] = x);
	},

	componentWillMount () {
		this.eventItems = {};
	},

	validate () {
		const errors = [];
		const {items = []} = this.state || {};
		for(let i = 0; i < items.length; i++) {
			const item = this.eventItems[`item-${i}`];
			if (item && item.validate && !item.validate() ) {
				errors.push(item);
			}
		}
		return errors.length === 0;
	},

	remove (index) {
		this.removeEntry(index);
	},

	render () {
		let {mimeType, fieldNames, field, schema} = this.props;
		let {items} = this.state || {};

		let {itemSchema} = schema[field] || {};

		return (
			<div>
				{(items || []).map((item, index) => {
					return (
						<div className="entry" key={`item-${index}`}>
							<RemoveIcon onClick={this.remove} index={index} />
							<EventItem schema={itemSchema} item={item} ref={this.getRefCallback(index)} mimeType={mimeType} fieldNames={fieldNames}/>
						</div>
					);
				})}
				<div className="controls buttons">
					<AddEntryButton onClick={this.addEntry} />
				</div>
			</div>

		);
	}
});

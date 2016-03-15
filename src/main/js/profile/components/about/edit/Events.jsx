import React from 'react';

import AddEntryButton from './AddEntryButton';
import EventItem from './EventItem';
import Mixin from './Mixin';

export default React.createClass({
	displayName: 'Events:Edit',
	mixins: [Mixin],

	propTypes: {
		items: React.PropTypes.array,

		field: React.PropTypes.string.isRequired,

		schema: React.PropTypes.object.isRequired,

		mimeType: React.PropTypes.string.isRequired,

		fieldNames: React.PropTypes.arrayOf(React.PropTypes.string).isRequired
	},

	validate () {
		const errors = [];
		const {items = []} = this.state || {};
		for(let i = 0; i < items.length; i++) {
			const item = this[`item-${i}`];
			if (item && item.validate && !item.validate() ) {
				errors.push(item);
			}
		}
		return errors.length === 0;
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
							<div className="remove icon-bold-x" onClick={this.removeEntry.bind(this, index)}/>
							<EventItem schema={itemSchema} item={item} ref={x => this[`item-${index}`] = x} mimeType={mimeType} fieldNames={fieldNames}/>
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

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
							<EventItem schema={itemSchema} item={item} ref={`item-${index}`} mimeType={mimeType} fieldNames={fieldNames}/>
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

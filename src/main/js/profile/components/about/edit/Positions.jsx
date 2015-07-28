import React from 'react';
import Mixin from './Mixin';
import PositionItem from './PositionItem';
import AddEntryButton from './AddEntryButton';

const MimeType = 'application/vnd.nextthought.profile.professionalposition';

export default React.createClass({
	displayName: 'Positions:Edit',
	mixins: [Mixin],

	propTypes: {
		items: React.PropTypes.array,

		field: React.PropTypes.string.isRequired
	},

	render () {
		let {items} = this.state || {};

		return (
			<div>
				{(items || []).map((item, index) => {
					return (
						<div className="entry" key={`item-${index}`}>
							<div className="remove icon-bold-x" onClick={this.removeEntry.bind(this, index)}/>
							<PositionItem item={item} ref={`item-${index}`}/>
						</div>
					);
				})}
				<div className="controls buttons">
					<AddEntryButton onClick={this.addEntry.bind(this, MimeType)} />
				</div>
			</div>

		);
	}
});

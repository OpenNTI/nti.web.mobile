import React from 'react';
import Mixin from './Mixin';
import PositionItem from './PositionItem';

const MimeType = 'application/vnd.nextthought.profile.professionalposition';

export default React.createClass({
	displayName: 'Positions:Edit',

	mixins: [Mixin],

	getMimeType() {
		return MimeType;
	},

	render () {
		let {items} = this.state;
		return (
			<div>
				{(items || []).map((item, index) => {
					return (
						<div className="entry">
							<div className="remove icon-bold-x" onClick={this.removeEntry.bind(this, index)}></div>
							<PositionItem item={item} key={`position-item-${index}`} onChange={this.itemChanged.bind(this, item)} />
						</div>
					);
				})}
				<div className="controls buttons">
					<button onClick={this.addEntry}>Add Entry</button>
				</div>
			</div>

		);
	}
});

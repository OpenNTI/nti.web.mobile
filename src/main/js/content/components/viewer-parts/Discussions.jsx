import React from 'react';

import Item from './DiscussionItem';

const notes = x => x.isNote;

export default React.createClass({
	displayName: 'content:Discussions',

	propTypes: {
		items: React.PropTypes.array
	},

	render () {
		let items = this.props.items.filter(notes);

		return (
			<div className="discussions">
				<h1>Discussions</h1>

				<div className="list">
					{items.map(x => <Item item={x.getRecord()} key={x.id}/>)}
				</div>
			</div>
		);
	}
});

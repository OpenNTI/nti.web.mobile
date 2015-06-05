import React from 'react';

import Bookmark from './Bookmark';
import Like from './Like';

export default React.createClass({
	displayName: 'LuckyCharms',

	propTypes: {
		item: React.PropTypes.object.isRequired
	},

	render () {
		let {item} = this.props;

		return (
			<div className="charms">
				<Like item={item}/>
				{item.isTopLevel() && ( <Bookmark item={item}/> )}
			</div>
		);
	}
});

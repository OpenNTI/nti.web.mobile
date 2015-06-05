import React from 'react';

import Favorite from './Favorite';
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
				{item.isTopLevel() && ( <Favorite item={item}/> )}
			</div>
		);
	}
});

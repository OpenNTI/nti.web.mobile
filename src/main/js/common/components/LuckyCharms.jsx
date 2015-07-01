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

		if (!item.isTopLevel) {
			console.warn('Item doesn\'t have isTopLevel method. bailing.');
			return null;
		}

		return (
			<div className="charms">
				<Like item={item}/>
				{item.isTopLevel() && ( <Favorite item={item}/> )}
			</div>
		);
	}
});

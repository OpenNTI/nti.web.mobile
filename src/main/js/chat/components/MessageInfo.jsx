import React from 'react';

import Body from 'modeled-content/components/Panel';

export default React.createClass({
	displayName: 'MessageInfo',

	propTypes: {
		item: React.PropTypes.object.isRequired
	},

	render () {
		let {item} = this.props;

		return (
			<div>
				<Body body={item.body}/>
			</div>
		);
	}
});

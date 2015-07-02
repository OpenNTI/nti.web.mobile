import React from 'react';

import ellipsis from '../mixins/EllipsisText';

export default React.createClass({
	displayName: 'ellipsis',
	mixins: [ellipsis],

	propTypes: {
		tag: React.PropTypes.string
	},

	getDefaultProps () {
		return {
			tag: 'div'
		};
	},


	render () {
		let {tag} = this.props;
		return React.createElement(tag, this.props);
	}
});

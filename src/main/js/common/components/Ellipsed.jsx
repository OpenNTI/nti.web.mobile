import React from 'react';

import ellipsis, {trim} from '../mixins/EllipsisText';

export default React.createClass({
	displayName: 'ellipsis',
	mixins: [ellipsis],

	statics: {
		trim
	},

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

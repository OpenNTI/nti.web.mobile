import React from 'react';

import PureRenderMixin from 'react/lib/ReactComponentWithPureRenderMixin';

export default React.createClass({
	displayName: 'ReturnTo',
	mixins: [PureRenderMixin],

	propTypes: {
		href: React.PropTypes.string,
		label: React.PropTypes.string
	},


	render () {
		let {href, label} = this.props;
		let props = {
			className: 'return-to',
			href,
			title: label,
			children: label
		};

		return <a {...props}/>;
	}
});

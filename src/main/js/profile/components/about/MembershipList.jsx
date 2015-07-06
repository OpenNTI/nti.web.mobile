import React from 'react';

import Mixin from './Mixin';

export default React.createClass({
	displayName: 'MembershipList',

	propTypes: {
		list: React.PropTypes.array.isRequired,
		title: React.PropTypes.string,

		preview: React.PropTypes.bool
	},

	mixins: [Mixin],

	render () {

		let {title, preview, list = []} = this.props;

		if (list.length === 0) {
			return null;
		}

		if (preview) {
			list = list.slice(0, 5);
		}

		return (
			<div className="memberships">
				<h3>{title}</h3>
				<ul>
					{this.renderItems(list)}
				</ul>
			</div>
		);
	}
});

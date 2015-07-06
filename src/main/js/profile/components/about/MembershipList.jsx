import React from 'react';

import Mixin from './Mixin';

export default React.createClass({
	displayName: 'MembershipList',

	propTypes: {
		list: React.PropTypes.array.isRequired,
		title: React.PropTypes.string
	},

	mixins: [Mixin],

	render () {

		let {title, list = []} = this.props;

		if (list.length === 0) {
			return null;
		}

		return (
			<div>
				<h3>{title}</h3>
				<ul>
					{this.renderItems(list)}
				</ul>
			</div>
		);
	}
});

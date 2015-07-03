import React from 'react';

import Mixin from './Mixin';

import Card from '../Card';

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
			<Card title={title}>
				<ul>
					{this.renderItems(list)}
				</ul>
			</Card>
		);
	}
});

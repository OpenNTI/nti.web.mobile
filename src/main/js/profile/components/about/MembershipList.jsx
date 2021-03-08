import React from 'react';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import { Link } from 'react-router-component';

import { EmptyList } from '@nti/web-commons';

import Mixin from './Mixin';

export default createReactClass({
	displayName: 'MembershipList',

	propTypes: {
		list: PropTypes.array.isRequired,
		title: PropTypes.string,

		preview: PropTypes.bool,
	},

	mixins: [Mixin],

	render() {
		let { title, preview, list = [] } = this.props;

		if (preview) {
			list = list.slice(0, 5);
		}

		return (
			<div className="memberships">
				<h3>{title}</h3>
				{list.length > 0 ? (
					<ul>{this.renderItems(list)}</ul>
				) : (
					<EmptyList type={title.toLowerCase()} />
				)}
				{preview && (
					<Link href="/memberships/" className="more">
						Show More
					</Link>
				)}
			</div>
		);
	},
});

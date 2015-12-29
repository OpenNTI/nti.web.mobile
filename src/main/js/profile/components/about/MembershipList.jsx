import React from 'react';
import {Link} from 'react-router-component';

import EmptyList from 'common/components/EmptyList';

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

		if (preview) {
			list = list.slice(0, 5);
		}

		return (
			<div className="memberships">
				<h3>{title}</h3>
				{list.length > 0 ? <ul>{this.renderItems(list)}</ul> : <EmptyList type={title.toLowerCase()} />}
				{preview && ( <Link href="/memberships/" className="more">Show More</Link> )}
			</div>
		);
	}
});

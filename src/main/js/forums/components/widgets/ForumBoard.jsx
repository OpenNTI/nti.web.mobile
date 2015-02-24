import React from 'react';

import ForumItem from '../list-items/ForumItem';
import keyFor from '../../utils/key-for-item';

export default React.createClass({
	displayName: 'ForumBoard',

	propTypes: {
		board: React.PropTypes.object.isRequired,
		title: React.PropTypes.string.isRequired
	},

	render () {

		let {title, board} = this.props;
		let forums = (board||{}).forums||[];
		return (
			<div>
				<h3>{title}</h3>
				<ul>
					{forums.map(forum => {
						return <li key={keyFor(forum)}><ForumItem item={forum}/></li>;
					})}
				</ul>
			</div>
		);
	}
});

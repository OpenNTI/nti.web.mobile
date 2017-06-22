import React from 'react';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';

import Avatar from 'common/components/Avatar';
import DisplayName from 'common/components/DisplayName';

import ShowAvatars from '../mixins/ShowAvatarsChild';

export default createReactClass({
	displayName: 'StudentLink',

	mixins: [ShowAvatars],

	propTypes: {
		item: PropTypes.shape({
			username: PropTypes.string
		}).isRequired,
		children: PropTypes.any
	},

	render () {
		const {children, item} = this.props;
		const showAvatars = this.getShowAvatars();
		return (
			<a className="student-link" href={`./${encodeURIComponent(item.username)}/`}>
				{showAvatars && (<Avatar entity={item.user} suppressProfileLink />)}
				<div className="wrapper">
					<DisplayName entity={item.user} suppressProfileLink />
					{children}
				</div>
			</a>
		);
	}
});

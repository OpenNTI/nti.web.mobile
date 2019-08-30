import React from 'react';
import PropTypes from 'prop-types';

import Avatar from 'common/components/Avatar';
import DisplayName from 'common/components/DisplayName';

import {Receiver as ShowAvatars} from '../../bindings/ShowAvatars';

export default
@ShowAvatars.connect
class StudentLink extends React.Component {

	static propTypes = {
		item: PropTypes.shape({
			username: PropTypes.string,
			user: PropTypes.any
		}).isRequired,
		children: PropTypes.any,
		showAvatars: PropTypes.bool
	}

	render () {
		const {children, item, showAvatars} = this.props;

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
}

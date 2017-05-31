import PropTypes from 'prop-types';
import React from 'react';

import {getAppUsername} from 'nti-web-client';

import Avatar from 'common/components/Avatar';

export default class UserMenu extends React.PureComponent {

	static propTypes = {
		onClick: PropTypes.func
	}

	onClick = (e) => {
		e.preventDefault();
		e.stopPropagation();
		this.props.onClick();
	}

	render () {
		let props = {
			className: 'right-off-canvas-toggle',
			onClick: this.onClick,
			href: '#'
		};

		return <a {...props}><Avatar entity={getAppUsername()} suppressProfileLink/></a>;
	}
}

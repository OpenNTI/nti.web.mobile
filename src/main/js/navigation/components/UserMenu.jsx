import React from 'react';

import PureRenderMixin from 'react/lib/ReactComponentWithPureRenderMixin';

import {getAppUsername} from 'common/utils';

import Avatar from 'common/components/Avatar';

export default React.createClass({
	displayName: 'UserMenu',
	mixins: [PureRenderMixin],

	propTypes: {
		onClick: React.PropTypes.func
	},

	onClick (e) {
		e.preventDefault();
		e.stopPropagation();
		this.props.onClick();
	},

	render () {
		let props = {
			className: 'right-off-canvas-toggle',
			onClick: this.onClick,
			href: '#'
		};
		let username = getAppUsername();
		return <a {...props}><Avatar username={username} /></a>;
	}
});

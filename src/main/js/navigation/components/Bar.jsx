import React from 'react';
import cx from 'react/lib/cx';
import PureRenderMixin from 'react/lib/ReactComponentWithPureRenderMixin';

import {getAppUsername} from 'common/utils';

import Avatar from 'common/components/Avatar';

import BasePathAware from 'common/mixins/BasePath';

var Hamburger = React.createClass({
	mixins: [PureRenderMixin],

	onClick (e) {
		e.preventDefault();
		e.stopPropagation();
		this.props.onClick();
	},

	render () {
		let props = {
			className: 'left-off-canvas-toggle hamburger',
			onClick: this.onClick,
			href: '#'
		};

		return <a {...props}><span/></a>;
	}
});

var UserMenu = React.createClass({
	mixins: [PureRenderMixin],

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


export default React.createClass({
	displayName: 'NavigationBar',
	mixins: [BasePathAware],

	contextTypes: {
		triggerLeftMenu: React.PropTypes.func.isRequired,
		triggerRightMenu: React.PropTypes.func.isRequired
	},

	onMenuTap () {
	},


	render () {
		let {triggerLeftMenu, triggerRightMenu} = this.context;

		let left = <Hamburger onClick={triggerLeftMenu}/>;
		let right = <UserMenu onClick={triggerRightMenu}/>;

		let css = cx({
			'title': true,
			'branding': !!this.props.branding
		});

		return (
			<nav className="tab-bar">
				<section className="left-small">{left}</section>

				<section className="middle tab-bar-section">
					<a href={this.getBasePath()} onClick={this.onMenuTap}>
						<h1 className={css}>{this.props.title}</h1></a>
				</section>

				<section className="right-small">{right}</section>
			</nav>
		);
	}
});

import React from 'react';
import cx from 'react/lib/cx';
import PureRenderMixin from 'react/lib/ReactComponentWithPureRenderMixin';

import {getAppUsername} from 'common/utils';

import Avatar from 'common/components/Avatar';

import BasePathAware from 'common/mixins/BasePath';
import SetStateSafely from 'common/mixins/SetStateSafely';

// import hash from 'object-hash';

/*const Hamburger = React.createClass({
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
});*/

const UserMenu = React.createClass({
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


const ReturnTo = React.createClass({
	mixins: [PureRenderMixin],

	propTypes: {
		href: React.PropTypes.string,
		label: React.PropTypes.string
	},


	render () {
		let {href, label} = this.props;
		let props = {
			className: 'return-to',
			href,
			title: label,
			children: [label]
		};

		return <a {...props}/>;
	}
});


export default React.createClass({
	displayName: 'NavigationBar',
	mixins: [BasePathAware, SetStateSafely],

	contextTypes: {
		triggerLeftMenu: React.PropTypes.func.isRequired,
		triggerRightMenu: React.PropTypes.func.isRequired
	},


	propTypes: {
		branding: React.PropTypes.bool,
		//this context is not the same as the component's `this.context`
		contextProvider: React.PropTypes.func,
		menuItems: React.PropTypes.arrayOf(React.PropTypes.shape({
			label: React.PropTypes.string,
			href: React.PropTypes.string
		})),
		title: React.PropTypes.string
	},


	componentDidMount () {
		this.fillIn(this.props);
	},

	componentWillReceiveProps (nextProps) {
		//if (nextProps.contextProvider) {
			this.fillIn(nextProps);
		//}
	},


	fillIn (props) {
		let getContext = props.contextProvider;

		if (getContext) {
			getContext(props).then(x=>
				this.setStateSafely({
					returnTo: x && x[x.length-2]
				}));
		}


	},

	onMenuTap () {
	},


	getChildForSide(side) {
		let {children} = this.props;

		if (!Array.isArray(children)) {
			children = children ? [children] : [];
		}

		let is = x=> (x.props || {}).position === side ? x : null;

		return children.reduce((x,a)=>x || is(a), null);
	},


	getLeft () {
		//<Hamburger onClick={triggerLeftMenu}/>;
		let {returnTo} = this.state || {};
		if (returnTo) {
			return <ReturnTo {...returnTo}/>;
		}

		return this.getChildForSide('left');
	},


	getRight () {
		let {triggerRightMenu} = this.context;
		return this.getChildForSide('right') || <UserMenu onClick={triggerRightMenu}/>;
	},

	getCenter () {
		let css = cx({
			'title': true,
			'branding': !!this.props.branding
		});

		return this.getChildForSide('center') ||
			this.getMenu() || (

			<a href={this.getBasePath()} onClick={this.onMenuTap}>
				<h1 className={css}>{this.props.title}</h1></a>
		);
	},


	getMenu () {

	},


	render () {
		return (
			<nav className="tab-bar">
				<section className="left-small">{this.getLeft()}</section>
				<section className="middle tab-bar-section">{this.getCenter()}</section>
				<section className="right-small">{this.getRight()}</section>
			</nav>
		);
	}
});

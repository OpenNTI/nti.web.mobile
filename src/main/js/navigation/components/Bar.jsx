import path from 'path';
import React from 'react';
import Transition from 'react/lib/ReactCSSTransitionGroup';
import cx from 'react/lib/cx';

import PureRenderMixin from 'react/lib/ReactComponentWithPureRenderMixin';

import {getAppUsername} from 'common/utils';

import ActiveState from 'common/components/ActiveState';
import Avatar from 'common/components/Avatar';
import Pager from 'common/components/Pager';

import {addClass, removeClass} from 'common/utils/dom';

import BasePathAware from 'common/mixins/BasePath';
import NavigatableMixin from 'common/mixins/NavigatableMixin';
import SetStateSafely from 'common/mixins/SetStateSafely';

const getViewport = ()=> document.getElementsByTagName('html')[0];

// const Hamburger = React.createClass({
// 	mixins: [PureRenderMixin],
//
// 	onClick (e) {
// 		e.preventDefault();
// 		e.stopPropagation();
// 		this.props.onClick();
// 	},
//
// 	render () {
// 		let props = {
// 			className: 'left-off-canvas-toggle hamburger',
// 			onClick: this.onClick,
// 			href: '#'
// 		};
//
// 		return <a {...props}><span/></a>;
// 	}
// });




const Menu = React.createClass({
	componentDidMount () {
		addClass(getViewport(), 'scroll-lock');
	},

	componentWillUnmount () {
		removeClass(getViewport(), 'scroll-lock');
	},

	render () {
		return (<ul {...this.props}/>);
	}
});


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
			children: label
		};

		return <a {...props}/>;
	}
});


export default React.createClass({
	displayName: 'NavigationBar',
	mixins: [BasePathAware, NavigatableMixin, SetStateSafely],

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


	getInitialState () {
		return {
			menuOpen: false
		};
	},


	componentDidMount () {
		this.fillIn(this.props);
	},


	componentWillReceiveProps (nextProps) {
		//if (nextProps.contextProvider) {
			this.fillIn(nextProps);
		//}
		this.setState({menuOpen: false});
	},


	fillIn (props) {
		let {navigatableContext, contextProvider} = props;
		let resolve = Promise.resolve();

		if (contextProvider) {
			resolve = contextProvider((navigatableContext || {}).props || props);
		}

		resolve.then(x=>
			this.setStateSafely({
				returnTo: x && x[x.length-2]
			}));
	},


	getChildForSide(side) {
		let {children} = this.props;

		if (!Array.isArray(children)) {
			children = children ? [children] : [];
		}

		let is = x=> ((x && x.props) || {}).position === side ? x : null;

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
		return this.getChildForSide('right') || <UserMenu onClick={()=>{
			this.closeMenu();triggerRightMenu();}}/>;
	},


	getCenter () {
		let css = cx({
			'title': true,
			'branding': !!this.props.branding
		});

		return this.getChildForSide('center') ||
			this.getMenu() || (

			<a href={this.getBasePath()}>
				<h1 className={css}>{this.props.title}</h1></a>
		);
	},


	getMenu () {
		let {availableSections} = this.props;
		let css = cx({
			'title': true,
			'menu': true
		});

		if (!availableSections) {
			return;
		}

		let ref = this.makeHref(this.getPath());

		let {label} = availableSections.find(x=>
			ref.indexOf(path.normalize(this.makeHref(x.href))) === 0) || {};

		//jsxhint is killing me... it's not comprehending the default value in the destructuing assignment... :}
		if (!label) {
			label = 'Menu';
		}

		return (
			<a href="#" onClick={this.toggleMenu}><h1 className={css}>{label}</h1></a>
		);
	},


	toggleMenu (e) {
		e.preventDefault();
		e.stopPropagation();

		let s = !this.state.menuOpen;
		this.setStateSafely({menuOpen: s});
	},


	closeMenu (e) {
		if (e) {
			e.preventDefault();
			e.stopPropagation();
		}
		this.setStateSafely({menuOpen: false});
	},


	render () {
		let {menuOpen} = this.state;

		let css = cx({
			'nav-menu-open': menuOpen
		});

		return (
			<div className={css}>
				<Transition transitionName="nav-menu">
					{menuOpen && <a href="#" className="nav-menu-mask" onClick={this.closeMenu} key="mask"/>}
					{this.renderMenu()}
				</Transition>
				{this.renderBar()}
			</div>
		);
	},


	renderBar () {
		let {pageSource, currentPage, navigatableContext} = this.props;

		return (
			<nav className="tab-bar">
				<section className="left-small">{this.getLeft()}</section>
				<section className="middle tab-bar-section">{this.getCenter()}</section>
				<section className="right-small">
					{pageSource && <Pager pageSource={pageSource} current={currentPage} navigatableContext={navigatableContext}/>}
					{this.getRight()}
				</section>
			</nav>
		);
	},


	renderMenu () {
		let {menuOpen} = this.state;
		let {availableSections} = this.props;
		let props = {
			className: 'title-bar-menu',
			key: 'menu'
		};

		let sectionProps = x=> {
			let title = x.label;
			let href = path.normalize(this.makeHref(x.href));
			return Object.assign({children: title}, x, {title, href});
		};

		if (!availableSections) {
			return;
		}

		let sections = availableSections.map(sectionProps);

		return menuOpen && React.createElement(Menu, props,
				...sections.map(x=>
					<ActiveState tag="li" hasChildren {...x}><a {...x}/></ActiveState>
				));
	}

});

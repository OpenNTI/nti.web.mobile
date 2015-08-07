import React from 'react';
import Transition from 'react/lib/ReactCSSTransitionGroup';

import path from 'path';
import cx from 'classnames';

import buffer from 'nti.lib.interfaces/utils/function-buffer';

import Pager from 'common/components/Pager';

import BasePathAware from 'common/mixins/BasePath';
import NavigatableMixin from 'common/mixins/NavigatableMixin';
import StoreEvents from 'common/mixins/StoreEvents';

import Menu from './Menu';
import UserMenu from './UserMenu';
import ReturnTo from './ReturnTo';

import NavStore from '../Store';

const menuOpenBodyClass = 'nav-menu-open';

function ensureSlash (str) {
	const split = /[?#]/.exec(str);
	let args = '';
	if (split) {
		let {index} = split;
		args = str.substr(index);
		str = str.substr(0, index);
	}

	str = /\/$/.test(str) ? str : (str + '/');

	return str + args;
}

export default React.createClass({
	displayName: 'NavigationBar',
	mixins: [StoreEvents, BasePathAware, NavigatableMixin],

	contextTypes: {
		triggerRightMenu: React.PropTypes.func.isRequired
	},

	propTypes: {
		branding: React.PropTypes.bool,
		menuItems: React.PropTypes.arrayOf(React.PropTypes.shape({
			label: React.PropTypes.string,
			href: React.PropTypes.string
		})),
		title: React.PropTypes.string,

		children: React.PropTypes.any,
		availableSections: React.PropTypes.array
	},

	backingStore: NavStore,
	backingStoreEventHandlers: {
		default: buffer(10, function () {
			let o = NavStore.getData();
			if (this.isMounted()) {
				// console.debug('Set Context: %o', o);
				this.setState(o);
				this.fillIn(o);
			}
		})
	},



	getInitialState () {
		return {
			menuOpen: false
		};
	},


	componentDidMount () {},


	componentWillReceiveProps () {
		this.closeMenu();
	},


	fillIn (state) {
		let {context} = state || this.state;
		let nc = context || {};

		let resolve = Promise.resolve();

		let getContext = nc.resolveContext || nc.getContext;

		if (getContext) {
			resolve = getContext();
		}

		resolve.then(x=>
			//console.debug('Context Path: %o', x) ||
			this.setState({
				current: x && x[x.length - 1],
				returnTo: x && x[x.length - 2]
			}));
	},


	getChildForSide (side) {
		let {children} = this.props;

		if (!Array.isArray(children)) {
			children = children ? [children] : [];
		}

		let is = x=> ((x && x.props) || {}).position === side ? x : null;

		return children.reduce((x, a)=>x || is(a), null);
	},


	getLeft () {
		let {returnTo} = this.state || {};
		if (returnTo) {
			return <ReturnTo {...returnTo}/>;
		}

		return this.getChildForSide('left');
	},


	getRight () {
		let {triggerRightMenu} = this.context;
		return this.getChildForSide('right') || <UserMenu onClick={()=> {
			this.closeMenu();
			triggerRightMenu();
		}}/>;
	},


	getCenter () {
		let css = cx({
			'title': true,
			'branding': !!this.props.branding
		});

		let {current} = this.state;

		let title = (current || {}).label || this.props.title;

		return this.getChildForSide('center') ||
			this.getMenu() || (

			<a href={this.getBasePath()}>
				<h1 className={css}>{title}</h1></a>
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


		let {label = 'Menu'} = this.getActiveSection() || {};

		return (
			<a href="#" onClick={this.toggleMenu}><h1 className={css}>{label}</h1></a>
		);
	},


	getActiveSection () {
		let candidate;
		let ref = ensureSlash(this.makeHref(this.getPath()));
		let {availableSections} = this.props;
		for(let x of availableSections) {
			if (ref.indexOf(path.normalize(this.makeHref(x.href))) === 0) {
				if (!candidate || candidate.href.length < x.href.length) {
					candidate = x;
				}
			}
		}

		return candidate;
	},


	toggleMenu (e) {
		e.preventDefault();
		e.stopPropagation();

		let s = !this.state.menuOpen;
		this.updateBodyClassForMenu(s);
		this.setState({menuOpen: s});
	},

	updateBodyClassForMenu (isOpen) {
		// video elements interfere with the menu interaction. adding a class to body
		// when the menu is open allows us to use css to get the videos out of the way.
		if (isOpen) {
			document.body.classList.add(menuOpenBodyClass);
		}
		else {
			document.body.classList.remove(menuOpenBodyClass);
		}
	},

	closeMenu (e) {
		if (e) {
			e.preventDefault();
			e.stopPropagation();
		}
		this.updateBodyClassForMenu(false);
		this.setState({menuOpen: false});
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
		let {pageSource, currentPage, context} = this.state;

		let middle = cx('middle tab-bar-section', {
			'has-pager': pageSource
		});

		return (
			<nav className="tab-bar">
				<section className="left-small">{this.getLeft()}</section>
				<section className={middle}>{this.getCenter()}</section>
				<section className="right-small">
					{pageSource && <Pager pageSource={pageSource} current={currentPage} navigatableContext={context}/>}
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

		let active = this.getActiveSection();

		let sectionProps = x=> {
			let title = x.label;
			let href = path.normalize(this.makeHref(x.href));
			return Object.assign({children: title}, x, {title, href, active: active === x});
		};

		if (!availableSections) {
			return;
		}

		let sections = availableSections.map(sectionProps);

		return menuOpen && React.createElement(Menu, props,
				...sections.map(x=>
					<li {...x}><a {...x}/></li>
				));
	}

});

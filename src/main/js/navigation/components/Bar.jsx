import React from 'react';
import Transition from 'react-addons-css-transition-group';

import path from 'path';
import cx from 'classnames';

import {Logger} from 'nti-lib-interfaces';
import buffer from 'nti-lib-interfaces/lib/utils/function-buffer';

import C from 'common/components/Conditional';
import Pager from 'common/components/Pager';

import BasePathAware from 'common/mixins/BasePath';
import NavigatableMixin from 'common/mixins/NavigatableMixin';
import StoreEvents from 'common/mixins/StoreEvents';

import Menu from './Menu';
import UserMenu from './UserMenu';
import ReturnTo from './ReturnTo';

import NavStore from '../Store';

const logger = Logger.get('NavigationBar');
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
		default: buffer(100, function () {
			let o = NavStore.getData();
			if (this.isMounted()) {
				logger.debug('Set Context: %o', o);
				this.setState(Object.assign({resolving: true}, o),
					()=> this.fillIn(o));
			}
		})
	},



	getInitialState () {
		return {
			resolving: true,
			menuOpen: false
		};
	},


	componentDidMount () {},


	componentWillReceiveProps () {
		this.closeMenu();
	},


	fillIn (state = this.state) {
		const {path: contextPath = []} = state;
		const [current, returnTo] = contextPath.slice().reverse();

		logger.debug('Context Path: %s', contextPath.map(a=>a.label).join(', '));
		this.setState({
			current,
			returnTo,
			resolving: false
		});
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
			return <section><ReturnTo {...returnTo}/></section>;
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
			this.getMenu() || (title ? (

			<a href={this.getBasePath()}>
				<h1 className={css}>{title}</h1>
			</a>

		) : null);
	},


	getMenu () {
		let {availableSections} = this.props;

		if (!availableSections) {
			return;
		}


		let {label = 'Menu'} = this.getActiveSection() || {};

		return (
			<a href="#" onClick={this.toggleMenu} className="menu">
				<h1 className="title">{label}</h1>
			</a>
		);
	},


	getActiveSection () {
		let candidate;
		let ref = ensureSlash(this.makeHref(this.getPath()));

		let {availableSections} = this.props;

		if (availableSections) {

			for(let x of availableSections) {
				if (ref.indexOf(path.normalize(this.makeHref(x.href))) === 0) {
					if (!candidate || candidate.href.length < x.href.length) {
						candidate = x;
					}
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
				<Transition transitionName="nav-menu" transitionEnterTimeout={350} transitionLeaveTimeout={350}>
					{menuOpen && <a href="#" className="nav-menu-mask" onClick={this.closeMenu} key="mask"/>}
					{this.renderMenu()}
				</Transition>
				{this.renderBar()}
			</div>
		);
	},


	renderBar () {
		let {pageSource, currentPage, context, resolving} = this.state;

		return (
			<nav className="nav-bar">
				{this.getLeft()}
				<C condition={!resolving} tag="section" className={cx('middle', {'has-pager': pageSource})}>
					{this.getCenter()}
				</C>
				<section>
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
			return Object.assign({children: title}, x, {title, href, className: cx(x.className, {active: active === x})});
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

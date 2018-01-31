import path from 'path';

import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import createReactClass from 'create-react-class';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import {buffer} from 'nti-commons';
import Logger from 'nti-util-logger';
import {Pager, Mixins} from 'nti-web-commons';
import {StoreEventsMixin} from 'nti-lib-store';
import {Input} from 'nti-web-search';

import NavStore from '../Store';

import Menu from './Menu';
import UserMenu from './UserMenu';
import ReturnTo from './ReturnTo';

const Transition = (props) => ( <CSSTransition classNames="nav-menu" timeout={350} {...props}/> );

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

export default createReactClass({
	displayName: 'NavigationBar',
	mixins: [StoreEventsMixin, Mixins.BasePath, Mixins.NavigatableMixin],

	contextTypes: {
		triggerRightMenu: PropTypes.func.isRequired
	},

	propTypes: {
		branding: PropTypes.bool,
		menuItems: PropTypes.arrayOf(PropTypes.shape({
			label: PropTypes.string,
			href: PropTypes.string
		})),
		title: PropTypes.string,

		children: PropTypes.any,
		availableSections: PropTypes.array,
		supportsSearch: PropTypes.bool,
		border: PropTypes.bool
	},

	backingStore: NavStore,
	backingStoreEventHandlers: {
		default: buffer(100, function () {
			let o = NavStore.getData();
			logger.debug('Set Context: %o', o);
			this.setState(Object.assign({resolving: true}, o),
				()=> this.fillIn(o));
		})
	},


	attachSearchRef (x) { this.search = x; },


	getInitialState () {
		return {
			resolving: true,
			menuOpen: false
		};
	},


	componentWillReceiveProps () {
		this.closeMenu();
	},


	fillIn (state = this.state) {
		const {path: contextPath = []} = state;
		const [current, returnTo] = contextPath.slice().reverse();

		logger.debug('Context Path: %s', contextPath.map(a=> a ? a.label : void 0).join(', '));
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

	userMenuClicked () {
		let {triggerRightMenu} = this.context;
		this.closeMenu();
		triggerRightMenu();
	},

	getRight () {
		return this.getChildForSide('right') || <UserMenu onClick={this.userMenuClicked}/>;
	},

	getCenter () {
		let css = cx({
			'title': true,
			'branding': !!this.props.branding
		});

		let {current} = this.state;

		let title = (current || {}).label || this.props.title;

		return this.getChildForSide('center')
			|| this.getMenu()
			|| (title ? (

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


	launchSearch () {
		this.setState({
			searchOpen: true,
			menuOpen: false
		}, () => {
			if (this.search) {
				this.search.focus();
			}
		});
	},


	closeSearch (e) {
		e.preventDefault();

		if (this.search) {
			this.search.clear();
		}

		this.setState({
			searchOpen: false
		});
	},


	render () {
		let {menuOpen} = this.state;

		let css = cx({
			'nav-menu-open': menuOpen
		});

		return (
			<div className={css}>
				<TransitionGroup>
					{menuOpen && (
						<Transition key="mask">
							<a href="#" className="nav-menu-mask" onClick={this.closeMenu} />
						</Transition>
					)}
					{this.renderMenu()}
				</TransitionGroup>
				{this.renderBar()}
			</div>
		);
	},


	renderBar () {
		const {supportsSearch, border} = this.props;
		let {pageSource, currentPage, context, resolving, searchOpen} = this.state;

		return (
			<nav className={cx('nav-bar', {border})}>
				{this.getLeft()}
				{!resolving && (
					<section className={cx('middle', {'has-pager': pageSource})}>
						{this.getCenter()}
					</section>
				)}
				<section>
					{pageSource && <Pager pageSource={pageSource} current={currentPage} navigatableContext={context}/>}
					{supportsSearch && (<a href="#"><i className="icon-search launch-search" onClick={this.launchSearch} /></a>)}
					{this.getRight()}
				</section>
				{searchOpen && this.renderSearch()}
			</nav>
		);
	},


	renderMenu () {
		let {menuOpen} = this.state;
		let {availableSections} = this.props;
		let props = {
			className: 'title-bar-menu',
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

		return menuOpen && (
			<Transition key="menu">
				<Menu {...props}>
					{sections.map((x,i)=>
						<li key={i} {...x}><a {...x}/></li>
					)}
				</Menu>
			</Transition>
		);
	},


	renderSearch () {
		return (
			<div className="search-container">
				<i className="icon-search" />
				<Input ref={this.attachSearchRef} />
				<a href="#" className="close-search" onClick={this.closeSearch}>
					<i className="icon-bold-x"/>
				</a>
			</div>
		);
	}

});

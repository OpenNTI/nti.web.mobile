import './Bar.scss';
import path from 'path';

import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import createReactClass from 'create-react-class';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import {buffer} from '@nti/lib-commons';
import Logger from '@nti/util-logger';
import {Pager, Mixins, Navigation, DateTime} from '@nti/web-commons';
import {StoreEventsMixin} from '@nti/lib-store';
import {Input} from '@nti/web-search';
import {LinkTo, getHistory} from '@nti/web-routing';

import NavStore from '../Store';

import Menu from './Menu';
import UserMenu from './UserMenu';
import ReturnTo from './ReturnTo';

const Transition = (props) => ( <CSSTransition classNames="nav-menu" timeout={350} {...props}/> );

const logger = Logger.get('NavigationBar');
const menuOpenBodyClass = 'nav-menu-open';


function getPageSourceInfo (pageSource, currentPage) {
	if (!pageSource || !currentPage) { return null; }

	const id = pageSource && (pageSource.id || (pageSource.root && pageSource.root.getID()));
	const root = pageSource && pageSource.root;
	const toc = root && root.toc;
	const isRealPages = (toc && !!toc.realPageIndex) || false;

	let current;
	let total;

	if (isRealPages) {
		const {realPageIndex} = toc || {};
		const allPages = realPageIndex && realPageIndex.NTIIDs[root.getID()];

		total = allPages && allPages[allPages.length - 1];
		current = realPageIndex && realPageIndex.NTIIDs[currentPage][0];
	} else {
		const pages = pageSource && pageSource.getPagesAround(currentPage, root);

		current = pages ? pages.index + 1 : 0;
		total = pages ? pages.total : 0;
	}

	return {
		id,
		current,
		total
	};
}

function getPagerPropsInfo (pagerProps) {
	return {
		id: pagerProps.root,
		current: (pagerProps.currentIndex || 0) + 1,
		total: pagerProps.total || 0
	};
}


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
		router: PropTypes.object,
		triggerRightMenu: PropTypes.func.isRequired
	},

	childContextTypes: {
		router: PropTypes.object
	},

	propTypes: {
		branding: PropTypes.bool,
		menuItems: PropTypes.arrayOf(PropTypes.shape({
			label: PropTypes.string,
			href: PropTypes.string
		})),
		title: PropTypes.string,
		className: PropTypes.string,
		children: PropTypes.any,
		course: PropTypes.object,
		availableSections: PropTypes.array,
		supportsSearch: PropTypes.bool,
		border: PropTypes.bool,
		useCommonTabs: PropTypes.bool,
		menuInitialState: PropTypes.oneOf(['open', 'closed']),
		searchTerm: PropTypes.string,
		theme: PropTypes.object
	},

	getDefaultProps () {
		return {
			menuInitialState: 'closed'
		};
	},

	backingStore: NavStore,
	backingStoreEventHandlers: {
		default: buffer(100, function () {
			let o = NavStore.getData();
			logger.debug('Set Context: %o', o);
			this.setState({resolving: true, ...o},
				()=> this.fillIn(o));
		})
	},


	componentDidUpdate (prevProps) {
		const {searchTerm} = this.props;
		const {searchOpen} = this.state;

		if(!searchOpen && searchTerm) {
			this.launchSearch(null, true);
		} else if (prevProps.searchTerm && searchTerm == null && searchOpen) {
			this.setState({
				searchOpen: false
			});
		}

		this.maybeFlashPages();
	},


	attachSearchRef (x) { this.search = x; },
	commonTabsRef: React.createRef(),


	getChildContext () {
		if (!this.props.useCommonTabs) { return {}; }

		return {
			router: {
				...this.context.router,
				history: getHistory()
			}
		};
	},


	getInitialState () {
		return {
			resolving: true,
			menuOpen: this.props.menuInitialState === 'open'
		};
	},

	maybeFlashPages () {
		const {pageSource, pagerProps, currentPage, flashPage, showFlash: wasShowing} = this.state;
		const info = pagerProps ? getPagerPropsInfo(pagerProps) : getPageSourceInfo(pageSource, currentPage);

		if (!info) {
			if (wasShowing) {
				this.setState({
					showFlash: false,
					flashPage: null
				});
			}

			return;
		}

		const {id, current, total} = info;
		const {id:prevId, current:prevPage, total:prevTotal} = flashPage || {};

		const sameFlash = prevId === id && prevPage === current && prevTotal === total;

		if (sameFlash) {
			return;
		}

		const show = id === prevId && current !== prevPage;
		const newFlash = {id, current, total};

		if (wasShowing && show) {
			this.setState({
				showFlash: false,
				flashPage: newFlash
			}, () => {
				this.setState({
					showFlash: true
				});
			});
		} else {
			this.setState({
				showFlash: show,
				flashPage: newFlash
			});
		}
	},


	fillIn (state = this.state) {
		const {supportsSearch} = this.props;
		const {path: contextPath = []} = state;
		const [current, returnTo] = contextPath.slice().reverse();

		const {searchOpen} = this.state;
		const willSupportSearch = supportsSearch || current.supportsSearch;
		const shouldClearSearch = searchOpen && !willSupportSearch;

		if (shouldClearSearch) {
			this.search?.clear();
		}

		logger.debug('Context Path: %s', contextPath.map(a=> a ? a.label : void 0).join(', '));
		this.setState({
			current,
			returnTo: current && current.returnOverride ?
				current.returnOverride :
				(returnTo && (returnTo.returnOverride || returnTo) ),
			pagerProps: (current && current.pagerProps) || (returnTo && returnTo.pagerProps),
			resolving: false,
			searchOpen: shouldClearSearch ? false : searchOpen
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


	renderTab (tabCmp, tab) {
		return (
			<LinkTo.Path to={tab.route}>
				{tabCmp}
			</LinkTo.Path>
		);
	},


	renderCommonTabs () {
		if (this.state.resolving && !this.commonTabsRef.current) { return null; }

		const {CatalogEntry} = this.props.course || {};

		let inPreview = false;

		if(CatalogEntry && CatalogEntry.Preview) {
			inPreview = true;
		}

		let label = 'In Preview';

		if(CatalogEntry && CatalogEntry.getStartDate()) {
			label += ' - Starts ' + DateTime.format(CatalogEntry.getStartDate(), DateTime.MONTH_ABBR_DAY_YEAR);
		}

		return (
			<div className="common-tabs" ref={this.commonTabsRef}>
				<Navigation renderTab={this.renderTab}/>
				{inPreview && <div className="preview">{label}</div>}
			</div>
		);
	},

	getCenter () {
		if (this.props.useCommonTabs) {
			return this.renderCommonTabs();
		}

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


	onSelect () {
		this.closeMenu();
	},

	launchSearch (e, backAction) {
		e?.stopPropagation();
		e?.preventDefault();

		this.setState({
			searchOpen: true,
			menuOpen: false
		}, () => {
			if (this.search && !backAction) {
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
		const {supportsSearch, border, className, useCommonTabs, theme} = this.props;
		let {pageSource, current, currentPage, context, resolving, searchOpen, pagerProps} = this.state;
		const root = pageSource && pageSource.root;
		const toc = root && root.toc;
		const isRealPages = (toc && !!toc.realPageIndex) || false;

		return (
			<nav
				className={cx('nav-bar', {border, 'use-common-tabs': useCommonTabs}, className)}
				style={{background: theme && theme.backgroundColor}}
			>
				{this.getLeft()}
				<section className={cx('middle', {'has-pager': pageSource, resolving})}>
					{this.getCenter()}
				</section>
				<section className={cx('right-section')}>
					{pageSource && !pagerProps && <Pager pageSource={pageSource} current={currentPage} navigatableContext={context}  isRealPages={isRealPages} toc={toc} />}
					{pagerProps && (<Pager {...pagerProps} navigatableContext={context} />)}
					{(supportsSearch || (current && current.supportsSearch)) && (
						<a href="#" onClick={this.launchSearch}>
							<i className={cx('icon-search launch-search', theme && theme.icon)}  />
						</a>
					)}
					{this.getRight()}
				</section>
				{searchOpen && this.renderSearch()}
				{this.renderFlashPage()}
			</nav>
		);
	},


	renderFlashPage () {
		const {showFlash, flashPage: page} = this.state;

		if (!showFlash || !page || !page.total) { return null; }

		const {current, total} = page;

		return (
			<div className="flash-page-bar">
				<div className="flash-page">
					<strong>{current}</strong> of <strong>{total}</strong>
				</div>
			</div>
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
			return {children: title, ...x, title, href, className: cx(x.className, {active: active === x})};
		};

		if (!availableSections) {
			return;
		}

		let sections = availableSections.map(sectionProps);

		return menuOpen && (
			<Transition key="menu">
				<Menu {...props}>
					{sections.map((x,i)=>
						<li key={i} {...x}><a onClick={this.onSelect} {...x}/></li>
					)}
				</Menu>
			</Transition>
		);
	},


	renderSearch () {
		const {theme} = this.props;
		const icon = theme && theme.icon;

		return (
			<div className="search-container" style={{backgroundColor: theme && theme.backgroundColor}} >
				<i className={cx('icon-search', icon)} />
				<Input className={cx(theme && theme.search)} ref={this.attachSearchRef} />
				<a href="#" className="close-search" onClick={this.closeSearch}>
					<i className={cx('icon-bold-x', icon)}/>
				</a>
			</div>
		);
	}

});

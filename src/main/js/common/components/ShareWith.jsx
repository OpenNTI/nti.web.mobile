import React from 'react';
import cx from 'classnames';

import Logger from 'nti-util-logger';

import ShareTarget from './TokenEntity';
import SelectableEntities from './SelectableEntities';
import Search from './EntitySearch';

import {TinyLoader as Loading} from 'nti-web-commons';

import ListSelection from '../utils/ListSelectionModel';

import {getService} from 'nti-web-client';

const logger = Logger.get('common:components:ShareWith');

const KEY = 'defaultValue';

const EVENTS = ['focus', 'focusin', 'click', 'touchstart'];

const trim = x => typeof x === 'string' ? x.trim() : x;

export default React.createClass({
	displayName: 'ShareWith',

	propTypes: {
		defaultValue: React.PropTypes.array,

		scope: React.PropTypes.object,

		onBlur: React.PropTypes.func
	},


	getInitialState () {
		return {};
	},


	componentWillMount () {
		this.setup();
	},


	componentDidMount () {
		for(let e of EVENTS) {
			document.body.addEventListener(e, this.maybeCloseDrawer, e === 'focus');
		}
	},


	componentWillReceiveProps (nextProps) {
		if (nextProps[KEY] !== this.props[KEY]) {
			this.setup(nextProps);
		}
	},


	componentWillUnmount () {
		for(let e of EVENTS) {
			document.body.removeEventListener(e, this.maybeCloseDrawer, e === 'focus');
		}

		this.setState({focused: false});
	},


	setup (props = this.props) {
		const stillValid = () => props[KEY] === this.props[KEY];
		const {scope} = props;

		function getSuggestions () {
			try {
				return scope.getSharingSuggestions()
					.catch(e => {
						logger.error('Error getting suggestions: ', e.stack || e.message || e);
						return null;
					})
					.then(v => (v && v.length > 0) ? v : null);
			}
			catch (e) {
				return Promise.resolve(null);
			}
		}

		let value = props.defaultValue;

		let selection = new ListSelection(value);

		this.setState({value, selection});

		getService()
			.then(service => [
				service.getCommunities(),
				service.getGroups(),
				service.getLists(),
				service.getContacts()
			])

			.then(stores => Promise.all(stores.map(store=> store.waitForPending()))
							.then(()=> stores))

			.then(stores => Promise.all([getSuggestions(), ...stores]))

			.then(all => {
				let [suggestions, ...stores] = all;

				if (stillValid()) {
					const filter = x => !suggestions ? x : x && !suggestions.find(o => x.getID() === o.getID());
					const toArray = o => {
						let a = o ? Array.from(o).filter(filter) : [];
						return a.length ? a : null;
					};

					let [communities, groups, lists, contacts] = stores.map(s => toArray(s));

					this.setState({suggestionGroups: {suggestions, communities, groups, lists, contacts}});
				}
			});
	},


	maybeCloseDrawer (e) {
		const {state: {focused}, el, entry, props: {onBlur}} = this;

		if (!focused || !el) {
			return;
		}

		if (!el.contains(e.target)) {
			clearTimeout(this.maybeCloseDrawerTimout);
			this.maybeCloseDrawerTimout = setTimeout(()=> {

				let dy = el.offsetHeight - entry.offsetHeight;

				this.setState({focused: false}, onBlur);

				//When this is used on a desktop environment and the
				//list is "out of flow"/positioned... don't assume
				//inline-mobile-styles.
				scrollBy(0, -dy);

			}, 500);
		}
	},


	focusSearch () {
		let search = this.getSearchBoxEl();
		if (search) {
			search.focus();
		}
	},


	getSearchBoxEl () {
		return this.search;
	},


	onFocus () {
		this.setState({focused: true});
		this.focusSearch();
	},


	onInputBlur () {
		//this.setState({focused: true, inputFocused: false});
	},


	onListScroll () {
		const {scroller} = this;
		const search = this.getSearchBoxEl();
		if (search) {
			search.blur();
		}

		if (scroller) {
			scroller.focus();
		}

		clearTimeout(this.maybeCloseDrawerTimout);
		this.setState({focused: true, inputFocused: false});
	},


	onInputFocus () {
		clearTimeout(this.maybeCloseDrawerTimout);
		this.setState({focused: true, inputFocused: true});
	},


	onInputChange () {
		let search = (this.getSearchBoxEl() || {}).value;

		if (!search || search === '') {
			search = void 0;
		}

		this.onInputFocus();
		this.setState({search});
	},


	onSelectionChange (entity) {
		let {state: {selection}} = this;
		let result = selection.isSelected(entity)
			? selection.remove(entity)
			: selection.add(entity);

		// this.focusSearch();

		if (result) {
			this.forceUpdate();
		}
	},


	onTokenTap (e) {
		let {state: {pendingRemove}} = this;

		if (pendingRemove === e) {
			e = void 0;
		}

		this.setState({pendingRemove: e});
	},


	onKeyPressHandleDelete (e) {
		let {state: {selection, pendingRemove}} = this;

		if (e.target.value === '' && (e.keyCode === 8 || e.keyCode === 46)) {
			if (pendingRemove) {
				selection.remove(pendingRemove);
				pendingRemove = void 0;
			} else {
				let s = selection.getItems();
				pendingRemove = s[s.length - 1];
			}

			this.setState({pendingRemove});
		} else if (pendingRemove) {
			this.setState({pendingRemove: void 0});
		}
	},


	render () {
		let {state: {focused, inputFocused, pendingRemove, search, selection, suggestionGroups}} = this;
		const loading = !suggestionGroups;
		let groupings = Object.keys(suggestionGroups || {})
							.filter(x => suggestionGroups[x])
							.map(k => ({
								label: k,
								list: suggestionGroups[k]
							}));

		let placeholder = selection.empty ? 'Share with' : null;


		return (
			<div ref={x => this.el = x} className={cx('share-with', {'active': focused})}>

				<div ref={x => this.entry = x} className="share-with-entry" onClick={this.onFocus}>
					{selection.getItems().map(e =>
						<ShareTarget key={e.getID ? e.getID() : e} entity={e}
							selected={pendingRemove === e}
							onClick={this.onTokenTap}/>
					)}
					<span className="input-field" data-value={search}>
						<input type="text" ref={x => this.search = x} value={search} placeholder={placeholder}
							onBlur={this.onInputBlur}
							onFocus={this.onInputFocus}
							onChange={this.onInputChange}
							onKeyDown={this.onKeyPressHandleDelete}
							/>
					</span>
				</div>

				{focused && search ? (

					<div className="search-results">
						<div ref={x => this.scroller = x}
							onTouchStart={this.onListScroll}
							onScroll={this.onListScroll}
							className={cx('scroller', 'visible', {'restrict': inputFocused})}>

							<h3>Search Results:</h3>
							<Search allowAny allowContacts
								query={trim(search)}
								selection={selection}
								onChange={this.onSelectionChange}
								/>
						</div>
					</div>

				) : (
					<div className="suggestions">
					{!focused ? null : loading ? (
						<Loading />
					) : (

						<div ref={x => this.scroller = x}
							onTouchStart={this.onListScroll}
							onScroll={this.onListScroll}
							className={cx('scroller', 'visible', {'restrict': inputFocused})}>

						{groupings.map(o =>

							<div className="suggestion-group" key={o.label}>
								<h3>{o.label}</h3>
								<SelectableEntities entities={o.list}
									selection={selection}
									onChange={this.onSelectionChange}
									/>
							</div>

						)}

						</div>
					)}
					</div>
				)}
			</div>
		);
	},


	getValue (valueTransformer = o => typeof o === 'object' ? o.getID() : o) {
		let {state: {selection}} = this;
		return selection.getItems().map(valueTransformer);
	}
});

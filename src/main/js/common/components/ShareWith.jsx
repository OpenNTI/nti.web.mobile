import React from 'react';
import cx from 'classnames';
import ShareTarget from './TokenEntity';
import SelectableEntities from './SelectableEntities';
import Search from './EntitySearch';

import Loading from './TinyLoader';

import ListSelection from '../utils/ListSelectionModel';

import {getService} from '../utils';

const KEY = 'defaultValue';

const EVENTS = ['focus', 'focusin', 'click', 'touchstart'];

export default React.createClass({
	displayName: 'ShareWith',

	propTypes: {
		defaultValue: React.PropTypes.array,

		scope: React.PropTypes.object
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
	},


	setup (props = this.props) {
		const stillValid = () => this.isMounted() && props[KEY] === this.props[KEY];
		const error = e => { console.error('Error getting suggestions: ', e.stack || e.message || e); return null; };
		const {scope} = props;

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

			.then(stores => Promise.all([scope.getSharingSuggestions().catch(error), ...stores]))

			.then(all => {
				let [suggestions, ...stores] = all;

				if (stillValid()) {
					const filter = x => !suggestions.find(o => x.getID() === o.getID());
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
		if (!this.state.focused || !this.isMounted()) {
			return;
		}

		if (!React.findDOMNode(this).contains(e.target)) {
			this.setState({focused: false});
		}
	},


	focusSearch () {
		let search = this.getSearchBoxEl();
		if (search) {
			search.focus();
		}
	},


	getSearchBoxEl () {
		let {refs: {search}} = this;
		return search && React.findDOMNode(search);
	},


	onFocus () {
		this.setState({focused: true});
		this.focusSearch();
	},


	onInputBlur () {
		//this.setState({focused: true, inputFocused: false});
	},


	onSuggestionScroll () {
		const {refs: {scroller}} = this;
		const search = this.getSearchBoxEl();
		if (search) {
			search.blur();
		}

		if (scroller) {
			React.findDOMNode(scroller).focus();
		}

		this.setState({focused: true, inputFocused: false});
	},


	onInputFocus () {
		this.setState({focused: true, inputFocused: true});
	},


	onInputChange () {
		let search = this.getSearchBoxEl();
		search = search && (search.value || '').trim();

		if (!search || search === '') {
			search = void 0;
		}

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
			<div className={cx('share-with', {'active': focused})}>

				<div className="share-with-entry" onClick={this.onFocus}>
					{selection.getItems().map(e =>
						<ShareTarget key={e.getID()} entity={e}
							selected={pendingRemove === e}
							onClick={()=>this.onTokenTap(e)}/>
					)}
					<span className="input-field" data-value={search}>
						<input type="text" ref="search" value={search} placeholder={placeholder}
							onBlur={this.onInputBlur}
							onFocus={this.onInputFocus}
							onChange={this.onInputChange}
							onKeyDown={this.onKeyPressHandleDelete}
							/>
					</span>
				</div>

				{search ? (

					<div className="search-results">
						<h3>Search Results:</h3>
						<Search
							query={search}
							selection={selection}
							onChange={this.onSelectionChange}
							/>
					</div>

				) : (
					<div className="suggestions">
					{!focused ? null : loading ? (
						<Loading />
					) : (

						<div ref="scroller"
							onTouchStart={this.onSuggestionScroll}
							onScroll={this.onSuggestionScroll}
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


	getValue (valueTransformer = o => o.getID()) {
		let {state: {selection}} = this;
		return selection.getItems().map(valueTransformer);
	}
});

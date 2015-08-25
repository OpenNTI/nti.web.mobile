import React from 'react';
import cx from 'classnames';
import ShareTarget from './TokenEntity';
import SelectableEntities from './SelectableEntities';

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


	onFocus () {
		this.setState({focused: true});
	},

	onInputBlur () {
		this.setState({focused: true, inputFocused: false});
	},

	onInputFocus () {
		this.setState({focused: true, inputFocused: true});
	},

	onInputChange () {
		let {search} = this.refs;

		search = search && (React.findDOMNode(search).value || '').trim();

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

		if (result) {
			this.forceUpdate();
		}
	},


	render () {
		let {state: {focused, inputFocused, search, selection, suggestionGroups = {}}} = this;

		let groupings = Object.keys(suggestionGroups)
							.filter(x => suggestionGroups[x])
							.map(k => ({
								label: k,
								list: suggestionGroups[k]
							}));

		let placeholder = selection.empty ? 'Share with' : null;

		return (
			<div className={cx('share-with', {'active': focused})}>

				<div className="share-with-entry" onClick={this.onFocus}>
					{selection.getItems().map(e => (<ShareTarget key={e.getID()} entity={e}/>))}
					<span className="input-field">
						<input type="text" ref="search" value={search} placeholder={placeholder}
							onBlur={this.onInputBlur}
							onFocus={this.onInputFocus}
							onChange={this.onInputChange}
							/>
					</span>
				</div>

				<div className="suggestions">
				{!focused ? null : !groupings.length ? (
					null
				) : (

					<div key="suggestions" className={cx('scroller', 'visible', {'restrict': inputFocused})}>
					{groupings.map(o =>

						<div className="suggestion-group" key={o.label}>
							<h3>{o.label}</h3>
							<SelectableEntities entities={o.list} selection={selection} onChange={this.onSelectionChange}/>
						</div>

					)}

					</div>
				)}
			</div>
			</div>
		);
	}
});

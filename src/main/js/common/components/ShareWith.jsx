import React from 'react';

import ShareTarget from './TokenEntity';
import SelectableEntities from './SelectableEntities';

import ListSelection from '../utils/ListSelectionModel';

import {getService} from '../utils';

const KEY = 'defaultValue';


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


	componentWillReceiveProps (nextProps) {
		if (nextProps[KEY] !== this.props[KEY]) {
			this.setup(nextProps);
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
					let filter = x => !suggestions.find(o => x.getID() === o.getID());

					let [communities, groups, lists, contacts] = stores.map(s => Array.from(s).filter(filter));

					this.setState({suggestions, communities, groups, lists, contacts});
				}
			});
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
		let {state: {focused, search, selection, suggestions, communities}} = this;
		return (
			<div>

				<div className="share-with-entry" onClick={this.onFocus}>
					{selection.getItems().map(e => (<ShareTarget key={e.getID()} entity={e}/>))}
					<span className="input-field">
						<input type="text" value={search} onBlur={this.onInputBlur} onFocus={this.onInputFocus} onChange={this.onInputChange} ref="search"/>
					</span>
				</div>

				{!focused ? null : !suggestions ? (
					null
				) : (
					<div className="suggestions">
						<SelectableEntities entities={suggestions} selection={selection} onChange={this.onSelectionChange}/>
						<SelectableEntities entities={communities} selection={selection} onChange={this.onSelectionChange}/>
					</div>
				)}
			</div>
		);
	}
});

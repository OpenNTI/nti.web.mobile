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
		const stillValid = () => props[KEY] === this.props[KEY];
		const empty = () => null;

		let value = props.defaultValue;

		let selection = new ListSelection(value);

		this.setState({value, selection});

		getService()
			.then(service => ({
				communities: service.getCommunities(),
				groups: service.getGroups(),
				lists: service.getLists(),
				contacts: service.getContacts()

			}))
			.then(o => Promise.all(
				[
					o.communities.waitForPending(),
					o.groups.waitForPending(),
					o.lists.waitForPending(),
					o.contacts.waitForPending()
				]).then(()=> o))

			.then(o => Promise.all([
				props.scope.getSharingSuggestions().catch(empty),
				o.communities,
				o.groups,
				o.lists,
				o.contacts
			]))
			.then(all => {
				let [suggestions, communities, groups, lists, contacts] = all;

				if (stillValid()) {
					let filter = x => !suggestions.find(o => x.getID() === o.getID());

					communities = Array.from(communities).filter(filter);
					groups = Array.from(groups).filter(filter);
					lists = Array.from(lists).filter(filter);
					contacts = Array.from(contacts).filter(filter);

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
		let {selection} = this.state;
		let result = selection.isSelected(entity)
			? selection.remove(entity)
			: selection.add(entity);

		if (result) {
			this.forceUpdate();
		}
	},


	render () {
		let {focused, search, selection, suggestions, communities} = this.state;
		return (
			<div>

				<div className="share-with-entry" onClick={this.onFocus}>
					{selection.getItems().map(e => (<ShareTarget key={e} entity={e}/>))}
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

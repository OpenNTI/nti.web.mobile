import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import { Loading } from '@nti/web-commons';
import { Button } from '@nti/web-core';
import SelectableEntity from 'internal/common/components/SelectableEntity';

import { getStore, getSuggestedContacts } from '../Api';
import { USERS } from '../Constants';

function listContainsEntity(list, entity) {
	return (
		(list || []).findIndex(
			user => user.getID && user.getID() === entity.getID()
		) > -1
	);
}

export default class UserSearchField extends React.Component {
	static propTypes = {
		onChange: PropTypes.func,
		selected: PropTypes.array,
		onSave: PropTypes.func.isRequired,
		onCancel: PropTypes.func.isRequired,
		excludeContacts: PropTypes.any,
		saveButtonText: PropTypes.string,
		placeholder: PropTypes.string,
		saveDisabled: PropTypes.bool,
	};

	static defaultProps = {
		selected: [],
		saveButtonText: 'Add Selected',
		placeholder: 'Search',
	};

	state = {
		search: '',
		selectedUsers: [],
		searchResults: [],
		contactsResults: [],
		suggestedContacts: [],
	};

	attachInputRef = x => (this.query = x);

	componentDidMount() {
		this.setUpStore();
		this.getSuggestedContacts();
	}

	componentDidUpdate(_, prevState) {
		const { store } = prevState;
		const { store: nextStore } = this.state;

		if (store && store !== nextStore) {
			store.removeListener('change', this.onStoreChange);
		}

		if (nextStore && nextStore !== store) {
			nextStore.addListener('change', this.onStoreChange);
		}
	}

	componentWillUnmount() {
		let { store } = this.state;
		if (store) {
			store.removeListener('change', this.onStoreChange);
		}
	}

	onStoreChange = () => {
		this.forceUpdate();
	};

	setUpStore = () => {
		getStore(USERS).then(store => this.setState({ store }));
	};

	getSuggestedContacts = () => {
		getSuggestedContacts().then(results =>
			this.setState({ suggestedContacts: results || [] })
		);
	};

	focus = () => {
		this.query.focus();
	};

	selectionChange = user => {
		const {
			props: { onChange },
			state: { selectedUsers },
		} = this;

		const userId = user.getID();
		const newSelection = selectedUsers.slice(0);
		const index = newSelection.findIndex(item => item.getID() === userId);

		if (index > -1) {
			newSelection.splice(index, 1);
		} else {
			newSelection.push(user);
		}

		this.setState({ selectedUsers: newSelection });

		if (onChange) {
			onChange(user);
		}
	};

	getSelections = () => {
		return this.state.selectedUsers.slice();
	};

	onKeyDown = e => {
		// on backspace in an empty field remove the last selected user
		if (e.target.value === '' && (e.keyCode === 8 || e.keyCode === 46)) {
			let selectedUsers = this.getSelections();
			if (selectedUsers.length > 0) {
				return this.selectionChange(
					selectedUsers[selectedUsers.length - 1]
				);
			}
		}
	};

	queryChanged = event => {
		let query = event ? event.target.value : '';
		let { store } = this.state;

		let existing = this.state.search;

		// If the value didn't change don't do anything.
		// In Chrome on Android change events sometimes fire on blur(?)
		// and trigger this method unnecessarily.
		if (existing === query) {
			return;
		}

		this.setState({
			search: query,
			searchLoading: query.length > 0,
			searchResults: [],
			searchError: null,
		});

		if (store && store.search) {
			store
				.search(query)
				.then(results => {
					// search results include communities and friends lists; we only want users
					let contacts = [];
					for (let user of store) {
						if (store.entityMatchesQuery(user, query)) {
							contacts.push(user);
						}
					}
					let users = results.filter(entity => entity.isUser);
					this.setState({
						searchResults: users,
						searchLoading: false,
						contactsResults: contacts,
					});
				})
				.catch(reason => {
					if (
						typeof reason !== 'object' ||
						reason.statusCode !== -1
					) {
						this.setState({
							searchError: reason,
						});
					}
				});
		}
	};

	renderResults(heading, results, classes) {
		const classnames = cx('contact-list search-results', classes);
		const {
			props: { selected },
			state: { selectedUsers, search },
		} = this;

		// filter out already-selected users
		const filtered = results.filter(
			user => !listContainsEntity(selected, user)
		);

		return (
			<section>
				<h1>{heading}</h1>
				<ul className={classnames}>
					{filtered.length > 0 ? (
						filtered.map(entity => (
							<SelectableEntity
								key={'selectable-' + entity.getID()}
								entity={entity}
								selected={
									listContainsEntity(selectedUsers, entity) ||
									listContainsEntity(selected, entity)
								}
								onChange={this.selectionChange}
							/>
						))
					) : (
						<li className="no-results">
							{search.length > 2
								? 'No results'
								: 'Search too broad'}
						</li>
					)}
				</ul>
			</section>
		);
	}

	results() {
		let {
			searchResults,
			contactsResults,
			suggestedContacts,
			searchLoading,
			search,
		} = this.state;
		let children = [];
		if (searchLoading) {
			children.push(<Loading.Ellipse />);
		} else if (search.length === 0) {
			if (suggestedContacts.length > 0) {
				children.push(
					this.renderResults('Suggested Contacts', suggestedContacts)
				);
			}
		} else {
			if (this.props.excludeContacts === undefined) {
				children.push(
					this.renderResults('Contacts', contactsResults, 'contacts')
				);
			}
			children.push(this.renderResults('Search Results', searchResults));
		}
		return (
			<ul className="output-list">
				{children.map((child, index) => (
					<li key={index}>{child}</li>
				))}
			</ul>
		);
	}

	render() {
		const {
			props,
			state: { selectedUsers = [] },
		} = this;
		const { onCancel, onSave, placeholder, saveButtonText, saveDisabled } =
			props;

		return (
			<div className="user-search">
				<ul className="input-list">
					{selectedUsers.map(user => (
						<li
							key={'selected-' + user.getID()}
							className="selected-item"
						>
							{user.displayName}
						</li>
					))}
					<li key="input-field" className="input-field">
						<input
							type="text"
							className="search-input"
							ref={this.attachInputRef}
							onChange={this.queryChanged}
							onKeyDown={this.onKeyDown}
							placeholder={placeholder}
						/>
					</li>
				</ul>
				{this.results()}
				<div className="button-spacer">
					<div className="buttons">
						<Button onClick={onCancel} plain>
							Cancel
						</Button>
						<Button
							onClick={onSave}
							disabled={
								'saveDisabled' in props
									? saveDisabled
									: !selectedUsers?.length
							}
						>
							{saveButtonText}
						</Button>
					</div>
				</div>
			</div>
		);
	}
}

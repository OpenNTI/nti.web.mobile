import {join} from 'path';

import React from 'react';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import Logger from 'nti-util-logger';
import {
	Error as Err,
	Loading,
	Mixins
} from 'nti-web-commons';

import ContextSender from 'common/mixins/ContextSender';
import Page from 'common/components/Page';

import {getDistributionList} from '../Api';

import AddPeopleButton from './AddPeopleButton';
import ItemDetailHeader from './ItemDetailHeader';
import Selectables from './Selectables';
import UserSearchField from './UserSearchField';


const logger = Logger.get('contacts:components:ListDetail');

export default createReactClass({
	displayName: 'ListDetail',
	mixins: [ContextSender, Mixins.BasePath],
	propTypes: {
		id: PropTypes.string.isRequired
	},

	attachRef (x) { this.searchField = x; },

	getInitialState () {
		return {
			list: null,
			loading: true,
			adding: false,
			originalMembers: null
		};
	},

	componentDidMount () {
		this.getList();
	},

	componentWillUpdate (_, nextState) {
		let {list} = this.state;
		let nextList = nextState.list;

		if (list && list !== nextList) {
			list.removeListener('change', this.onStoreChange);
		}
		else if (nextList && nextList !== list) {
			nextList.addListener('change', this.onStoreChange);
		}
	},

	componentWillUnmount () {
		let {list} = this.state;
		if (list) {
			list.removeListener('change', this.onStoreChange);
		}
	},

	getContext () {
		return Promise.resolve([
			{
				href: join(this.getBasePath(), 'contacts', 'lists', '/'),
				label: 'Distribution Lists'
			},
			{
				label: 'List Details'
			}
		]);
	},

	onStoreChange () {
		this.forceUpdate();
	},

	getList (updateOriginal = false) {
		getDistributionList(this.props.id).then((result) => {
			if (!result) {
				return this.setState({
					error: new Error('Unable to load list'),
					list: null,
					loading: false
				});
			}
			let {originalMembers} = this.state;
			let members = (!updateOriginal && originalMembers) || (result.friends || []).slice();
			this.setState({
				list: result,
				originalMembers: members,
				loading: false
			});
		});
	},

	toggleMembership (entity) {
		let {list} = this.state;
		let p = !list.contains(entity) ? list.add(entity) : list.remove(entity);

		p.catch(reason => logger.error('There was a problem toggling membership on entity: reason: %o entity: %o', reason, entity));

		return p;
	},

	addPeople () {
		this.setState({
			adding: true
		}, () => {
			this.searchField.focus();
		});
	},

	cancelSearch () {
		this.setState({
			adding: false
		});
	},

	saveSearch () {
		let selections = this.searchField.getSelections();
		let {list} = this.state;
		list.add(...selections)
			.then(() => {
				this.setState({
					adding: false
				});
				this.getList(true);
			});
	},

	render () {

		let {loading, error, list} = this.state;

		if (error) {
			return <Err error={error} />;
		}

		if (loading) {
			return <Loading.Mask />;
		}

		if (!list) {
			return <div>List not loaded.</div>;
		}

		return (
			<Page>
				<div className="distribution-list-detail">
					<ItemDetailHeader list={list} />
					<div className="contacts-page-content">
						{this.state.adding ? (
							<UserSearchField ref={this.attachRef}
								selected={list.friends}
								onCancel={this.cancelSearch}
								onSave={this.saveSearch}
							/>
						) : (
							<div>
								<AddPeopleButton onClick={this.addPeople} />
								<Selectables
									entities={(list.friends || []).slice()}
									onChange={this.toggleMembership}
									labels={{selected: 'Remove', unselected: 'Undo'}}
								/>
							</div>
						)}
					</div>
				</div>
			</Page>
		);
	}
});

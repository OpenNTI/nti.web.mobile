import React from 'react';
import Api from '../Api';
import Loading from 'common/components/Loading';
import ContextSender from 'common/mixins/ContextSender';
import BasePath from 'common/mixins/BasePath';
import SelectableEntities from './SelectableEntities';
import Page from 'common/components/Page';
import GradientBackground from 'common/components/GradientBackground';
import UserSearchField from './UserSearchField';
import ItemDetailHeader from './ItemDetailHeader';
import Err from 'common/components/Error';
import {join} from 'path';
import AddPeopleButton from './AddPeopleButton';

export default React.createClass({
	displayName: 'ListDetail',
	mixins: [ContextSender, BasePath],
	propTypes: {
		id: React.PropTypes.string.isRequired
	},

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
		Api.getDistributionList(this.props.id)
		.then((result) => {
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
		p.catch(reason => console.error(reason));
		return p;
	},

	addPeople () {
		this.setState({
			adding: true
		}, () => {
			this.refs.searchField.focus();
		});
	},

	cancelSearch () {
		this.setState({
			adding: false
		});
	},

	saveSearch () {
		let selections = this.refs.searchField.getSelections();
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
			return <Loading />;
		}

		if (!list) {
			return <div>List not loaded.</div>;
		}

		return (
			<Page>
				<GradientBackground>
					<div className="distribution-list-detail">
						<ItemDetailHeader list={list} />
						<div className="contacts-page-content">
							{this.state.adding ?
								<UserSearchField ref="searchField"
									selected={list.friends}
									onCancel={this.cancelSearch}
									onSave={this.saveSearch}
								/>
								:
								<div>
									<AddPeopleButton onClick={this.addPeople} />
									<SelectableEntities entities={list.friends} onChange={this.toggleMembership} />
								</div>
							}
						</div>
					</div>
				</GradientBackground>
			</Page>
		);
	}
});

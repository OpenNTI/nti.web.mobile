import React from 'react';
import Api from '../Api';
import Loading from 'common/components/Loading';
// import {USERS} from '../Constants';
import ContextSender from 'common/mixins/ContextSender';
import BasePath from 'common/mixins/BasePath';
import SelectableEntity from './SelectableEntity';
import Page from 'common/components/Page';
import GradientBackground from 'common/components/GradientBackground';
import EmtpyList from 'common/components/EmptyList';
import cx from 'classnames';
import UserSearchField from './UserSearchField';
import ItemDetailHeader from './ItemDetailHeader';
import Err from 'common/components/Error';
import {join} from 'path';

const labels = {
	selected: 'Remove',
	unselected: 'Undo'
};

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

		let {loading, error, list, originalMembers} = this.state;

		if (error) {
			return <Err error={error} />;
		}

		if (loading) {
			return <Loading />;
		}

		if (!list) {
			return <div>List not loaded.</div>;
		}

		// let members = list.friends || [];
		let contactItems = originalMembers.map((c) =>
			<SelectableEntity
				key={c.getID()}
				entity={c}
				selected={list.contains(c)}
				labels={labels}
				onChange={this.toggleMembership}>
				{/* <div onClick={this.toggleMembership.bind(this, c)}>{list.contains(c) ? 'Remove' : 'Undo'}</div> */}
			</SelectableEntity>
		);

		let classes = cx('contact-list list-content', {'empty': contactItems.length === 0});

		return (
			<Page>
				<GradientBackground>
					<div className="distribution-list-detail">
						<ItemDetailHeader list={list} />
						{this.state.adding ?
							<div className="list-user-search">
								<UserSearchField ref="searchField" selected={list.friends} />
								<div className="buttons">
									<button className="secondary button tiny" onClick={this.cancelSearch}>Cancel</button>
									<button className="primary button tiny" onClick={this.saveSearch}>Add Selected</button>
								</div>
							</div>
							:
							<div>
								<div className="add-people" onClick={this.addPeople}>
									<i className="icon-add-user" />
									<span>Add People</span>
								</div>
								<div className="list-content-wrapper">
									<ul className={classes}>
										{contactItems.length > 0 ? contactItems : <li><EmtpyList type="contacts" /></li> }
									</ul>
								</div>
							</div>
						}
					</div>
				</GradientBackground>
			</Page>
		);
	}
});

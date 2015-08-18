import React from 'react';
import Api from '../Api';
import Loading from 'common/components/Loading';
// import {USERS} from '../Constants';
import {areYouSure} from 'prompts';
import ContextSender from 'common/mixins/ContextSender';
import BasePath from 'common/mixins/BasePath';
import SelectableEntity from './SelectableEntity';
import Page from 'common/components/Page';
import GradientBackground from 'common/components/GradientBackground';
import Navigatable from 'common/mixins/NavigatableMixin';
import {scoped} from 'common/locale';
import EmtpyList from 'common/components/EmptyList';
import cx from 'classnames';
import UserSearchField from './UserSearchField';

let t = scoped('CONTACTS');

export default React.createClass({
	displayName: 'ListDetail',
	mixins: [ContextSender, BasePath, Navigatable],
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
		return Promise.resolve({
			label: 'List Details'
		});
	},

	onStoreChange () {
		this.forceUpdate();
	},

	getList (updateOriginal = false) {
		Api.getDistributionList(this.props.id)
		.then((result) => {
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

	deleteList () {
		let {list} = this.state;
		areYouSure(t('deleteListPrompt')).then(() => {
			this.setState({
				loading: true
			});
			list.delete()
				.then(() => {
					this.navigate('/lists/');
				});
		});
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

		let {loading, list, originalMembers} = this.state;

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
				onChange={this.toggleMembership.bind(this, c)}>
				{/* <div onClick={this.toggleMembership.bind(this, c)}>{list.contains(c) ? 'Remove' : 'Undo'}</div> */}
			</SelectableEntity>
		);

		let classes = cx('contact-list list-content', {'empty': contactItems.length === 0});

		return (
			<Page>
				<GradientBackground>
					<div className="distribution-list-detail">
						<header className="item-detail-header">
							<h1>{list.displayName}</h1>
							<button className="delete-icon" onClick={this.deleteList}>Delete</button>
							<button className="rename" onClick={this.rename} >Rename</button>
						</header>
						{this.state.adding ?
							<div className="list-user-search">
								<UserSearchField ref="searchField" selected={list.friends} />
								<div className="buttons">
									<button className="secondary button tiny" onClick={this.cancelSearch}>Cancel</button>
									<button className="primary button tiny" onClick={this.saveSearch}>Save Selection</button>
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

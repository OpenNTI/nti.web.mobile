import React from 'react';
import Api from '../Api';
import Loading from 'common/components/Loading';
import {USERS} from '../Constants';

export default React.createClass({
	displayName: 'ListDetail',

	propTypes: {
		id: React.PropTypes.string.isRequired
	},

	getInitialState () {
		return {
			list: null,
			loading: true
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

	onStoreChange () {
		this.forceUpdate();
	},

	getList () {
		Promise.all([
			Api.getDistributionList(this.props.id),
			Api.getStore(USERS)
		]).then((results) => {
			this.setState({
				list: results[0],
				contacts: results[1],
				loading: false
			});
		});
	},

	toggleMembership (entity) {
		let {list} = this.state;
		let p = !list.contains(entity) ? list.add(entity) : list.remove(entity);
		p.catch(reason => console.error(reason));
	},

	render () {

		let {loading, list, contacts} = this.state;

		if (loading) {
			return <Loading />;
		}

		if (!list) {
			return <div>List not loaded.</div>;
		}

		let members = list.friends || [];
		let contactItems = [];
		for(let c of contacts) {
			contactItems.push(<li key={c.getID()} onClick={this.toggleMembership.bind(this,c)}>{c.displayName}</li>);
		}

		return (
			<div className="list-detail">
				<h1>{list.displayName}</h1>
				<ul className="list-members">
					{members.map(item => <li key={item.getID()}>{item.displayName}</li>)}
				</ul>
				<ul className="contacts-list">
					{contactItems}
				</ul>
			</div>
		);
	}
});

//node modules imports (react is always first), react components second, others after.
import React from 'react';
import {Link} from 'react-router-component';
import SwipeToRevealOptions from 'react-swipe-to-reveal-options';
import cx from 'classnames';

//nti modules imports
import {encodeForURI} from 'nti.lib.interfaces/utils/ntiids';

//intra-app module imports (ordered LocalName)
import Avatar from 'common/components/Avatar';
import DisplayName from 'common/components/DisplayName';
import EmptyList from 'common/components/EmptyList';
import Err from 'common/components/Error';
import Loading from 'common/components/Loading';

//local-relative modules (grouped by depth)
import mixin from '../mixins/Mixin';
import {LISTS} from '../Constants';

import ListMeta from './ListMeta';


export default React.createClass({
	displayName: 'Contacts:Groups',
	mixins: [mixin],
	storeType: LISTS,
	// listName: 'Distribution Lists',

	addList () {
		const {refs: {newListName}, state: {store}} = this;
		if (!store) {
			return;
		}

		let listName = newListName.value.trim();
		if(listName.length === 0) {
			return;
		}

		this.setState({ loading: true });

		store.createList(listName)
			.then(() => {
				this.setState({
					loading: false
				});
			});
	},

	deleteList (item, event) {
		if(event && event.stopPropagation) {
			event.stopPropagation();
			event.preventDefault();
		}
		// areYouSure(t('deleteListPrompt')).then(() => {
		// 	this.setState({
		// 		loading: true
		// 	});
		item.delete()
			.then(() => {
				this.setState({
					loading: false
				});
			});
		// });
	},

	renderListItem (item) {


		let rightOptions = [
			{
				label: 'Delete',
				class: cx('tiny button caution', {
					'disabled': !item.delete
				})
			}
		];

		return (
			<li className="has-swipe-controls" key={item.getID()}>
				<SwipeToRevealOptions
					rightOptions={rightOptions}
					callActionWhenSwipingFarRight={false}
					onRightClick={this.deleteList.bind(null,item)}
				>
					<a href={encodeForURI(item.getID())}>
						<Avatar entity={item} />
						<div className="body">
							<DisplayName entity={item} />
							<ListMeta entity={item} />
							{/*{item.delete && <div className="delete" onClick={this.deleteList.bind(this, item)}></div>}*/}
						</div>
					</a>
				</SwipeToRevealOptions>
			</li>
		);
	},

	render () {

		let {error, search, store} = this.state;

		if (error) {
			return <Err error={error} />;
		}

		if (!store || store.loading) {
			return <Loading />;
		}

		let items = [];
		for(let item of store) {
			if(!store.entityMatchesQuery || store.entityMatchesQuery(item, search)) {
				items.push(this.renderListItem(item));
			}
		}

		return (
			<div>
				<Link href="/lists/new/" className="button tiny create-button">Create new list</Link>
				<div>
					{items.length > 0 ? <ul className={'contacts-list lists avatar-grid'}>{items}</ul> : <EmptyList type="friendslists" />}
				</div>
				{this.afterList && this.afterList()}
			</div>
		);
	}

});

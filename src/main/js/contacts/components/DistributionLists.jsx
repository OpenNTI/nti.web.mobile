//node modules imports (react is always first), react components second, others after.
import React from 'react';
import {Link} from 'react-router-component';
import SwipeToRevealOptions from 'react-swipe-to-reveal-options';
import cx from 'classnames';

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
import DistributionListItem from './DistributionListItem';


export default React.createClass({
	displayName: 'Contacts:Lists',
	mixins: [mixin],
	storeType: LISTS,

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
		return <DistributionListItem item={item} onRightClick={this.deleteList} />;
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

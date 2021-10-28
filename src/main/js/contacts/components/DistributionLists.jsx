import createReactClass from 'create-react-class';
import { Link } from 'react-router-component';

import { Button } from '@nti/web-core';
import { EmptyList, Error as Err, Loading } from '@nti/web-commons';

import mixin from '../mixins/Mixin';
import { LISTS } from '../Constants';

import DistributionListItem from './DistributionListItem';

export default createReactClass({
	displayName: 'Contacts:Lists',
	mixins: [mixin],
	storeType: LISTS,

	deleteList(item, event) {
		if (event && event.stopPropagation) {
			event.stopPropagation();
			event.preventDefault();
		}
		// Prompt.areYouSure(t('deleteListPrompt')).then(() => {
		// 	this.setState({Link
		// 		loading: true
		// 	});
		item.delete().then(() => {
			this.setState({
				loading: false,
			});
		});
		// });
	},

	renderListItem(item) {
		return (
			<DistributionListItem
				key={item.getID()}
				item={item}
				onRightClick={this.deleteList}
			/>
		);
	},

	render() {
		let { error, search, store } = this.state;

		if (error) {
			return <Err error={error} />;
		}

		if (!store || store.loading) {
			return <Loading.Mask />;
		}

		let items = [];
		for (let item of store) {
			if (
				!store.entityMatchesQuery ||
				store.entityMatchesQuery(item, search)
			) {
				items.push(this.renderListItem(item));
			}
		}

		return (
			<div>
				<Button as={Link} href="/lists/new/" constructive rounded>
					Create new list
				</Button>
				<div>
					{items.length > 0 ? (
						<ul className={'contacts-list lists avatar-grid'}>
							{items}
						</ul>
					) : (
						<EmptyList type="friendslists" />
					)}
				</div>
				{this.afterList && this.afterList()}
			</div>
		);
	},
});

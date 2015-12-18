import React from 'react';
import cx from 'classnames';

import {encodeForURI} from 'nti.lib.interfaces/utils/ntiids';

import AssignmentStatusLabel from 'assessment/components/AssignmentStatusLabel';

import StoreEvents from 'common/mixins/StoreEvents';

import SearchSortStore from '../../SearchSortStore';

const getHistory = (x, h) => h && h.getItem(x.getID());

export default React.createClass({
	displayName: 'AssignmentItem',
	mixins: [StoreEvents],
	propTypes: {
		assignment: React.PropTypes.object.isRequired
	},

	backingStore: SearchSortStore,
	backingStoreEventHandlers: {
		default () {
			if(this.isMounted()) {
				this.forceUpdate();
			}
		}
	},

	render () {
		let {assignment} = this.props;
		const history = getHistory(assignment, SearchSortStore.history);

		return (
			<a className={cx('assignment-item', { complete: !!history })} href={`./${encodeForURI(assignment.getID())}/`}>
				{assignment.title}
				<AssignmentStatusLabel assignment={assignment} historyItem={history} showTimeWithDate/>
			</a>
		);
	}
});

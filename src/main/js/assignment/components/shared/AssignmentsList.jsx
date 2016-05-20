import React from 'react';

import {Loading} from 'nti-web-commons';
import EmptyList from 'common/components/EmptyList';

import AssignmentGroup from './AssignmentGroup';
import StoreAccessor from '../../mixins/AssignmentsListViewStoreAccessor';

export default React.createClass({
	displayName: 'AssignmentsList',
	mixins: [StoreAccessor],

	propTypes: {
		sort: React.PropTypes.any,
		search: React.PropTypes.string
	},

	getInitialState () {
		return {};
	},

	render () {
		const store = this.getStore();

		if(!store || store.loading) {
			return <Loading />;
		}

		if(store.length === 0) {
			return <EmptyList type="assignments" />;
		}

		return (
			<ul className="assignments-list">
				{store.map((group, index) => (
					<li key={index}>
						<AssignmentGroup group={group}/>
					</li>
				))}
			</ul>
		);
	}
});

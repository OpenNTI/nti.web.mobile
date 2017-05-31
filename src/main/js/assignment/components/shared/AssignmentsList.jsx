import React from 'react';

import createReactClass from 'create-react-class';

import {Loading, EmptyList} from 'nti-web-commons';

import AssignmentGroup from './AssignmentGroup';
import StoreAccessor from '../../mixins/AssignmentsListViewStoreAccessor';

export default createReactClass({
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
			return <Loading.Mask />;
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

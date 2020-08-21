import './AssignmentsList.scss';
import React from 'react';
import PropTypes from 'prop-types';
import {Loading, EmptyList} from '@nti/web-commons';

import AssignmentGroups from '../bindings/AssignmentGroups';

import AssignmentGroup from './AssignmentGroup';

export default
@AssignmentGroups.connect
class AssignmentsList extends React.Component {

	static propTypes = {
		store: PropTypes.any,
		sort: PropTypes.any,
		search: PropTypes.string
	}

	render () {
		const {store} = this.props;

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
}

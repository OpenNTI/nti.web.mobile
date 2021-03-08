import './AssignmentHeader.scss';
import React from 'react';
import PropTypes from 'prop-types';

import { decorate } from '@nti/lib-commons';
import { DateTime } from '@nti/web-commons';
import { scoped } from '@nti/lib-locale';

import AssignmentSummary from '../bindings/AssignmentSummary';

import FilterMenu from './FilterMenu';
import PageControls from './PageControls';
import OptionsMenu from './OptionsMenu';

const t = scoped(
	'nti-web-mobile.assignment.components.instructor.AssignmentHeader',
	{
		view: 'View Assignment',
	}
);

class AssignmentHeader extends React.Component {
	static propTypes = {
		assignment: PropTypes.object,
		store: PropTypes.object,
	};

	setPage = page => {
		this.props.store.loadPage(page);
	};

	render() {
		const { assignment, store } = this.props;

		return (
			<div className="gradebook-assignment-header">
				<OptionsMenu {...this.props} />
				<PageControls
					currentPage={store.getCurrentPage()}
					pageSize={store.getPageSize()}
					total={store.getTotal()}
					onChange={this.setPage}
				/>
				<div className="gradebook-assignment-title">
					{assignment.title}
				</div>
				<div className="meta">
					<DateTime date={assignment.getDueDate()} />
					<FilterMenu {...this.props} />
				</div>
				<div className="extras">
					<a href="../">{t('view')}</a>
				</div>
			</div>
		);
	}
}

export default decorate(AssignmentHeader, [AssignmentSummary.connect]);

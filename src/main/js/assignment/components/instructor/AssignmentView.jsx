import React from 'react';
import PropTypes from 'prop-types';
import {Loading} from '@nti/web-commons';

import {Component as ContextSender} from 'common/mixins/ContextSender';

import {Provider as ShowAvatars} from '../bindings/ShowAvatars';
import AssignmentSummary from '../bindings/AssignmentSummary';

import AssignmentHeader from './AssignmentHeader';
import GradebookTable from './gradebook-table/GradebookTable';

export default
@AssignmentSummary.connect
@ShowAvatars.connect
class InstructorAssignmentView extends React.Component {

	static propTypes = {
		assignment: PropTypes.object.isRequired,
		store: PropTypes.object.isRequired,
		rootId: PropTypes.string.isRequired
	}


	componentWillMount () {
		const SECOND_AGO = 1000;
		const {store} = this.props;
		const {loading = true, loaded} = store || {};

		const lastLoad = Date.now() - loaded;

		if (!loading &&  lastLoad > SECOND_AGO && store.reloadPage) {
			store.reloadPage(); //Just in case something changed.
		}
	}


	render () {
		const {store, assignment} = this.props;
		const props = { assignment };

		return (
			<div>
				<ContextSender getContext={getContext} {...this.props}/>
				<AssignmentHeader {...props} />
				{!store || store.loading ? <Loading.Mask /> : <GradebookTable {...props} />}
			</div>
		);
	}
}


async function getContext () {
	//this will be called with the contextSender's context ("this")
	const context = this;
	const {assignment, rootId} = context.props;

	return {
		label: assignment.title || 'Assignment',
		ntiid: assignment.getID(),
		href: context.makeHref(rootId + '/students/')
	};
}

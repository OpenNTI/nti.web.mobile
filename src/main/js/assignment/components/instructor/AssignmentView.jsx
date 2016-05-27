import React from 'react';

import {Loading} from 'nti-web-commons';

import ContextSender from 'common/mixins/ContextSender';
import {Mixins} from 'nti-web-commons';

import ShowAvatars from './mixins/ShowAvatarsContainer';
import Accessor from './mixins/AssignmentSummaryAccessor';

import AssignmentHeader from './AssignmentHeader';
import GradebookTable from './gradebook-table/GradebookTable';

export default React.createClass({
	displayName: 'instructor:AssignmentView',

	mixins: [Accessor, ContextSender, Mixins.Navigatable, ShowAvatars],

	propTypes: {
		rootId: React.PropTypes.string.isRequired
	},


	getContext () {
		const {rootId} = this.props;
		const assignment = this.getAssignment();
		return {
			label: assignment.title || 'Assignment',
			ntiid: assignment.getID(),
			href: this.makeHref(rootId + '/students/')
		};
	},


	componentWillMount () {
		const SECOND_AGO = 1000;
		const store = this.getStore();
		const {loading = true, loaded} = store || {};

		const lastLoad = Date.now() - loaded;

		if (!loading &&  lastLoad > SECOND_AGO && store.reloadPage) {
			store.reloadPage(); //Just in case something changed.
		}
	},


	render () {
		const Store = this.getStore();

		const props = { assignment: this.getAssignment() };

		return (
			<div>
				<AssignmentHeader {...props} />
				{!Store || Store.loading ? <Loading /> : <GradebookTable {...props} />}
			</div>
		);
	}
});

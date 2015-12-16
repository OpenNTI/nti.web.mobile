import React from 'react';

import {decodeFromURI} from 'nti.lib.interfaces/utils/ntiids';

import BasePathAware from 'common/mixins/BasePath';
import ContextContributor from 'common/mixins/ContextContributor';
import NavigatableMixin from 'common/mixins/NavigatableMixin';

import Err from 'common/components/Error';
import Loading from 'common/components/Loading';

import ContentViewer from 'content/components/Viewer';

export default React.createClass({
	displayName: 'AssignmentViewer',
	mixins: [BasePathAware, ContextContributor, NavigatableMixin],

	propTypes: {
		assignments: React.PropTypes.object.isRequired,

		explicitContext: React.PropTypes.object,

		course: React.PropTypes.object.isRequired,

		rootId: React.PropTypes.string.isRequired,
		userId: React.PropTypes.string
	},


	getInitialState () {
		return {loading: true};
	},


	getContext () {
		const {rootId} = this.props;
		return Promise.resolve({
			label: 'Assignment',//This is good enough
			ntiid: decodeFromURI(rootId),
			href: this.makeHref(rootId)
		});
	},

	componentWillMount () {
		const {assignments, rootId, userId} = this.props;
		const id = decodeFromURI(rootId);
		const assignment = assignments.getAssignment(id);

		this.setState({assignment});

		assignments.getHistoryItem(id, userId)
			.then(history => ({history}), error => ({error}))
			.then(state => this.setState({loading: false, ...state}));
	},


	render () {
		const {props: {course, explicitContext}, state: {assignment, error, history, loading}} = this;

		return error ? (
			<Err error={error}/>
		) : loading ? (
			<Loading />
		) : (
			<ContentViewer {...this.props}
				assessment={assignment}
				assessmentHistory={history}
				contentPackage={course}
				explicitContext={explicitContext || this}
				/>
		);
	}
});

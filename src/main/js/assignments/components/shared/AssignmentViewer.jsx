import React from 'react';

import {decodeFromURI} from 'nti-lib-interfaces/lib/utils/ntiids';

import BasePathAware from 'common/mixins/BasePath';
import ContextContributor from 'common/mixins/ContextContributor';
import NavigatableMixin from 'common/mixins/NavigatableMixin';

import Err from 'common/components/Error';
import Loading from 'common/components/Loading';

import ContentViewer from 'content/components/Viewer';

import AssignmentsAccessor from '../../mixins/AssignmentCollectionAccessor';

export default React.createClass({
	displayName: 'AssignmentViewer',
	mixins: [AssignmentsAccessor, BasePathAware, ContextContributor, NavigatableMixin],

	propTypes: {
		explicitContext: React.PropTypes.object,

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

	setup () {
		const {rootId, userId} = this.props;
		const id = decodeFromURI(rootId);
		const collection = this.getAssignments();
		const assignment = collection.getAssignment(id);

		this.setState({assignment});

		collection.getHistoryItem(id, userId)
			.then(history => ({history}), error => ({error}))
			.then(state => this.setState({loading: false, ...state}));

	},

	componentWillUnmount () {
		if (this.unsubcribe) {
			this.unsubcribe();
		}
	},

	componentReceivedAssignments (collection) {
		const changed = (assignmentId) => {
			if (assignmentId === decodeFromURI(this.props.rootId)) {
				this.setup();
			}
		};

		collection.on('reset-grade', changed);

		if (this.unsubcribe) {
			this.unsubcribe();
		}

		this.unsubcribe = () => {
			delete this.unsubcribe;
			collection.removeListener('reset-grade', changed);
		};

		this.setup();
	},


	render () {
		const {props: {explicitContext}, state: {assignment, error, history, loading}} = this;

		return error ? (
			<Err error={error}/>
		) : loading ? (
			<Loading />
		) : (
			<ContentViewer {...this.props}
				assessment={assignment}
				assessmentHistory={history}
				contentPackage={this.getCourse()}
				course={this.getCourse()}
				explicitContext={explicitContext || this}
				/>
		);
	}
});

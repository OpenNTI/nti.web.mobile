import React from 'react';

import createReactClass from 'create-react-class';

import {decodeFromURI} from 'nti-lib-ntiids';
import {Error as Err, Loading, Mixins} from 'nti-web-commons';
import ContextContributor from 'common/mixins/ContextContributor';


import ContentViewer from 'content/components/Viewer';

import AssignmentsAccessor from '../../mixins/AssignmentCollectionAccessor';

export default createReactClass({
	displayName: 'AssignmentViewer',
	mixins: [AssignmentsAccessor, Mixins.BasePath, ContextContributor, Mixins.NavigatableMixin],

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

	setup (props = this.props) {
		const {rootId, userId} = props;
		const id = decodeFromURI(rootId);
		const collection = this.getAssignments();

		Promise.all([
			ensureNotSummary(collection.getAssignment(id)),
			collection.getHistoryItem(id, userId)
		])
			.then(([assignment,history]) => ({assignment, history}), error => ({error}))
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


	componentWillReceiveProps (nextProps) {
		if (this.unsubcribe && this.props.rootId !== nextProps.rootId) {
			// this.setState({loading: true}, () => this.setup(nextProps));
			this.setup(nextProps);
		}
	},


	render () {
		const {props: {explicitContext}, state: {assignment, error, history, loading}} = this;

		return error ? (
			<Err error={error}/>
		) : loading ? (
			<Loading.Mask />
		) : !assignment ? (
			<Err error="Assignment Not Found"/>
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


function ensureNotSummary (a) {
	return a && a.ensureNotSummary();
}

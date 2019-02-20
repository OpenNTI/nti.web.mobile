import React from 'react';
import PropTypes from 'prop-types';
import {decodeFromURI} from '@nti/lib-ntiids';
import {Error as Err, Loading} from '@nti/web-commons';

import {Component as ContextContributor} from 'common/mixins/ContextContributor';
import ContentViewer from 'content/components/ViewerLoader';
import {resetAssignment} from 'assessment/Actions';

import Assignments from '../bindings/Assignments';

async function getAssignmentHistory (assignment, assignments) {
	const attempt = assignment && assignment.getLatestAttempt ? await assignment.getLatestAttempt() : null;

	if (attempt) {
		return attempt.getHistoryItem();
	}

	return assignments.getHistoryItem(assignment.getID());
}

export default
@Assignments.connect
class AssignmentViewer extends React.Component {

	static propTypes = {
		assignments: PropTypes.object,
		course: PropTypes.object,
		explicitContext: PropTypes.object,

		rootId: PropTypes.string.isRequired,
		userId: PropTypes.string
	}


	state = {loading: true}


	attachContextProvider = x => this.contextProvider = x

	resolveContext (...args) {
		return this.contextProvider.resolveContext(...args);
	}

	makeHref (...args) {
		return this.contextProvider ? this.contextProvider.makeHref(...args) : null;
	}


	componentDidMount () {
		this.setup();
	}


	componentDidUpdate (prevProps) {
		if (this.unsubscribe && this.props.rootId !== prevProps.rootId) {
			this.setup();
		}
	}


	componentWillUnmount () {
		if (this.unsubscribe) {
			this.unsubscribe();
		}
	}


	async setup ({assignments, rootId, userId} = this.props) {
		const id = decodeFromURI(rootId);

		this.subscribe(assignments);

		const state = {};

		try {
			const initAssignment = await ensureNotSummary(assignments.getAssignment(id));
			const history = userId ? await assignments.getHistoryItem(id, userId) : await getAssignmentHistory(initAssignment, assignments);
			const historyItem = history && history.getMostRecentHistoryItem ? history.getMostRecentHistoryItem() : history;
			// const [initAssignment,history] = await Promise.all([
			// 	ensureNotSummary(assignments.getAssignment(id)),
			// 	assignments.getHistoryItem(id, userId)
			// ]);

			const maybeAutoStart = initAssignment.shouldAutoStart && initAssignment.shouldAutoStart();
			let assignment = initAssignment;

			if (historyItem) {
				if(historyItem && historyItem.MetadataAttemptItem && historyItem.MetadataAttemptItem.hasLink('Assignment')) {
					const historicalAssignment = await historyItem.MetadataAttemptItem.fetchLink('Assignment');
					await initAssignment.refresh(historicalAssignment);
					assignment = initAssignment;
				}
			}
			else if (maybeAutoStart && !initAssignment.hasLink('PracticeSubmission')) {
				assignment = await initAssignment.start();
			}

			Object.assign(state, {assignment, history});
		}
		catch (e) {
			state.error = e;
		}
		finally {
			this.setState({loading: false, ...state});
		}
	}


	subscribe (collection) {
		const changed = (assignmentId) => {
			if (assignmentId === decodeFromURI(this.props.rootId)) {
				this.setup();
			}
		};

		collection.on('reset-grade', changed);

		if (this.unsubscribe) {
			this.unsubscribe();
		}

		this.unsubscribe = () => {
			delete this.unsubscribe;
			collection.removeListener('reset-grade', changed);
		};
	}


	onTryAgain = async () => {
		const {assignment} = this.state;

		try {
			await assignment.start();

			resetAssignment(assignment);

			this.setState({
				assignment,
				history: null
			});
		} catch (e) {
			//swallow
		}

	}


	render () {
		const {
			props: {
				course,
				explicitContext,
				rootId,
			},
			state: {
				assignment,
				error,
				history,
				loading
			}
		} = this;

		return (
			<ContextContributor ref={this.attachContextProvider} getContext={getContext} rootId={rootId}>
				{error ? (
					<Err error={error}/>
				) : loading ? (
					<Loading.Mask />
				) : !assignment ? (
					<Err error="Assignment Not Found"/>
				) : (
					<ContentViewer {...this.props}
						assessment={assignment}
						assessmentHistory={history}
						onTryAgain={this.onTryAgain}
						contentPackage={course}
						course={course}
						explicitContext={explicitContext || this}
					/>
				)}
			</ContextContributor>
		);
	}
}


function ensureNotSummary (a) {
	return a && a.ensureNotSummary();
}


async function getContext () {
	const {rootId} = this.props;
	return {
		label: 'Assignment',//This is good enough
		ntiid: decodeFromURI(rootId),
		href: this.makeHref(rootId)
	};
}

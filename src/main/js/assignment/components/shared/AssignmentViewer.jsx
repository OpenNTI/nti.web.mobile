import React, {Fragment} from 'react';
import PropTypes from 'prop-types';
import {decodeFromURI} from 'nti-lib-ntiids';
import {Error as Err, Loading} from 'nti-web-commons';

import {Component as ContextContributor} from 'common/mixins/ContextContributor';
import ContentViewer from 'content/components/Viewer';

import Assignments from '../bindings/Assignments';

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
		return this.contextProvider.makeHref(...args);
	}


	componentWillMount () {
		this.setup();
	}


	componentWillReceiveProps (nextProps) {
		if (this.unsubcribe && this.props.rootId !== nextProps.rootId) {
			this.setup(nextProps);
		}
	}


	componentWillUnmount () {
		if (this.unsubcribe) {
			this.unsubcribe();
		}
	}


	async setup ({assignments, rootId, userId} = this.props) {
		const id = decodeFromURI(rootId);

		const state = {};

		try {
			const [assignment,history] = await Promise.all([
				ensureNotSummary(assignments.getAssignment(id)),
				assignments.getHistoryItem(id, userId)
			]);

			Object.assign(state, {assignment, history});
		}
		catch (e) {
			state.error = e;
		}
		finally {
			this.setState({loading: false, ...state});
		}
	}


	subcribe (collection) {
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
			<Fragment>
				<ContextContributor ref={this.attachContextProvider} getContext={getContext} rootId={rootId}/>
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
						contentPackage={course}
						course={course}
						explicitContext={explicitContext || this}
					/>
				)}
			</Fragment>
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

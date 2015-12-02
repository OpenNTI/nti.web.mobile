import React from 'react';

import {decodeFromURI} from 'nti.lib.interfaces/utils/ntiids';

import Loading from 'common/components/Loading';

import GradebookTable from './GradebookTable';

export default React.createClass({
	displayName: 'instructor:AssignmentView',

	propTypes: {
		assignments: React.PropTypes.object.isRequired,
		rootId: React.PropTypes.string.isRequired
	},

	getInitialState () {
		return {
			loading: true
		};
	},

	componentWillMount () {
		this.load();
	},

	componentWillReceiveProps (nextProps) {
		this.load(nextProps);
	},

	load (props = this.props) {
		const {assignments, rootId} = props;
		const assignment = assignments.getAssignment(decodeFromURI(rootId));
		assignment.fetchLinkParsed('GradeBookByAssignment', {filter: 'Open'})
			.then(gradebookByAssignment => {
				this.setState({
					loading: false,
					summary: gradebookByAssignment
				});
			});
	},

	render () {

		if(this.state.loading) {
			return <Loading />;
		}

		const {summary} = this.state;

		return (
			<div>Assignment view (instructor).
				<GradebookTable items={summary.Items} />
			</div>
		);
	}
});

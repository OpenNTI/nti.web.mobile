import React from 'react';

import {PropType as NTIID} from 'nti-lib-ntiids';

import cx from 'classnames';

import ItemChanges from 'common/mixins/ItemChanges';
import AssignmentsAccessor from '../../mixins/AssignmentCollectionAccessor';

import {areYouSure} from 'prompts';

import MenuTransitionGroup from './MenuTransitionGroup';


export default React.createClass({
	displayName: 'instructor:ActionsMenu',
	mixins: [AssignmentsAccessor, ItemChanges],

	propTypes: {
		userId: React.PropTypes.string.isRequired,

		assignmentId: NTIID, //when the row item does not specify the assignment... #smh

		/**
		 * 	needs to be a summary item or an object that conforms
		 * 	to the SummaryItem interface eg:
		 *
		 * 		.assignmentId
		 * 		.username
		 * 		.grade
		 */
		item: React.PropTypes.object.isRequired
	},

	getInitialState () {
		return {
			open: false
		};
	},


	getAssignmentId () {
		const {item, assignmentId} = this.props;
		return item.assignmentId || assignmentId;
	},


	getItem (props = this.props) {
		const {grade} = props.item || {};
		return grade;
	},


	excuse () {
		this.closeMenu();
		this.getItem().excuseGrade();
	},


	resetAssignment () {
		this.closeMenu();
		const {item, userId} = this.props;

		const reset = () => {
			return this.getAssignments().resetAssignment(this.getAssignmentId(), userId);
		};

		const msg = !item.isCreatedByAppUser
			? 'This will reset this assignment for this student. It is not recoverable.\nFeedback and work will be deleted.'
			: 'This will reset the assignment. All work will be deleted and is not recoverable.';

		areYouSure(msg)
			.then(reset)
			.then(
				()=> console.log('Assignment Reset'),
				e => console.error('Could not reset', e.stack || e.message || e));
	},


	toggleMenu () {
		this.setState({open: !this.state.open});
	},


	closeMenu () {
		this.setState({open: false});
	},


	render () {
		const grade = this.getItem();
		const {open} = this.state;
		const classes = cx('gradebook-actions-menu', { open });

		const excuseAction = grade && grade.isExcused() ? 'Unexcuse Grade' : 'Excuse Grade';

		return !grade ? null : (
			<div onClick={this.toggleMenu} className={classes}>
				<i className="icon-more-options" />
				{open &&
					<MenuTransitionGroup>
						<ul>
							<li onClick={this.resetAssignment}>Reset Assignment</li>
							<li onClick={this.excuse}>{excuseAction}</li>
						</ul>
					</MenuTransitionGroup>
				}
			</div>
		);
	}
});

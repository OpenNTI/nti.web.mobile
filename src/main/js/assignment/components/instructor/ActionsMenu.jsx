import './ActionsMenu.scss';
import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import {decorate} from '@nti/lib-commons';
import {PropType as NTIID} from '@nti/lib-ntiids';
import {HOC, Prompt} from '@nti/web-commons';
import Logger from '@nti/util-logger';
import {scoped} from '@nti/lib-locale';

import Assignments from '../bindings/Assignments';

import MenuTransitionGroup from './MenuTransitionGroup';

const logger = Logger.get('assignment:components:instructor:ActionsMenu');

const t = scoped('nti-web-mobile.assignment.components.instructor.ActionsMenu', {
	reset: 'Reset Assignment',
	excuse: 'Excuse Grade',
	unexcuse: 'Unexcuse Grade',
	resetWarning: {
		self: 'This will reset the assignment. All work will be deleted and is not recoverable.',
		other: 'This will reset this assignment for this student. It is not recoverable.\nFeedback and work will be deleted.'
	}
});

class ActionsMenu extends React.Component {

	static propTypes = {
		userId: PropTypes.string.isRequired,

		assignments: PropTypes.object,
		assignmentId: NTIID, //when the row item does not specify the assignment... #smh

		/**
		 * 	needs to be a summary item or an object that conforms
		 * 	to the SummaryItem interface eg:
		 *
		 * 		.assignmentId
		 * 		.username
		 * 		.grade
		 */
		item: PropTypes.object.isRequired
	}


	//This refocuses ItemChanges to the grade, instead of the summary item (since the grade is what changes)
	static getItem (props = {}) {
		const {grade} = props.item || {};
		return grade;
	}


	state = {
		open: false
	}


	getAssignmentId () {
		const {item, assignmentId} = this.props;
		return item.assignmentId || assignmentId;
	}


	getGrade () {
		const {item} = this.props;
		return (item || {}).grade;
	}


	excuse = () => {
		this.closeMenu();
		const grade = this.getGrade();

		if (grade) {
			grade.excuseGrade();
		}
	}


	resetAssignment = () => {
		this.closeMenu();
		const {assignments, item, userId} = this.props;

		const reset = () => {
			return assignments.resetAssignment(this.getAssignmentId(), userId);
		};

		const msg = !item.isCreatedByAppUser
			? t('resetWarning.other')
			: t('resetWarning.self');

		Prompt.areYouSure(msg)
			.then(reset)
			.then(
				()=> logger.log('Assignment Reset'),
				e => logger.error('Could not reset', e.stack || e.message || e));
	}


	toggleMenu = () => {
		this.setState({open: !this.state.open});
	}


	closeMenu () {
		this.setState({open: false});
	}


	render () {
		const grade = this.getGrade();
		const {open} = this.state;
		const classes = cx('gradebook-actions-menu', { open });

		const excuseAction = grade && grade.isExcused() ? t('unexcuse') : t('excuse');

		return !grade ? null : (
			<div onClick={this.toggleMenu} className={classes}>
				<i className="icon-more-options small" />
				{open && (
					<MenuTransitionGroup>
						<ul key="menu">
							<li onClick={this.resetAssignment}>{t('reset')}</li>
							<li onClick={this.excuse}>{excuseAction}</li>
						</ul>
					</MenuTransitionGroup>
				)}
			</div>
		);
	}
}


export default decorate(ActionsMenu, [
	Assignments.connect,
	HOC.ItemChanges.compose,
]);

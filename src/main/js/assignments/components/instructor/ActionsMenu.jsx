import React from 'react';

import cx from 'classnames';

import {PropType as NTIID} from 'nti-lib-interfaces/lib/utils/ntiids';

import ItemChanges from 'common/mixins/ItemChanges';
import AssignmentsAccessor from '../../mixins/AssignmentCollectionAccessor';

import {areYouSure} from 'prompts';

import MenuTransitionGroup from './MenuTransitionGroup';


export default React.createClass({
	displayName: 'instructor:ActionsMenu',
	mixins: [AssignmentsAccessor, ItemChanges],

	propTypes: {
		assignmentId: NTIID,
		userId: React.PropTypes.string.isRequired,

		item: React.PropTypes.object.isRequired
	},

	getInitialState () {
		return {
			open: false
		};
	},


	getItem (props = this.props) {
		const {item} = props;
		const {grade} = item.HistoryItemSummary || {};

		return grade;
	},


	excuse () {
		this.closeMenu();
		this.getItem().excuseGrade();
	},


	resetAssignment () {
		this.closeMenu();

		const reset = () => {

		};


		areYouSure('Reset this assignment?').then(reset);
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

		const excuseAction = grade.isExcused() ? 'Unexcuse Grade' : 'Excuse Grade';

		return (
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

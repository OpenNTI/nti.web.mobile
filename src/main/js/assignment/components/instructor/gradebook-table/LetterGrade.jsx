import React from 'react';
import cx from 'classnames';
import Grade from 'nti-lib-interfaces/lib/models/courses/Grade';
import Logger from 'nti-util-logger';
import {PropType as NTIID} from 'nti-lib-ntiids';

import Accessor from '../../../mixins/AssignmentCollectionAccessor';

const logger = Logger.get('assignment:components:instructor:gradebook-table:LetterGrade');

export default React.createClass({
	displayName: 'LetterGrade',
	mixins: [Accessor],

	propTypes: {
		grade: React.PropTypes.object,

		userId: React.PropTypes.string.isRequired,

		assignmentId: NTIID.isRequired
	},

	attachRef (r) {
		this.select = r;
	},

	onGradeChange () {
		this.setGrade(this.select.value);
	},

	setGrade (newLetter) {
		const {grade, assignmentId, userId} = this.props;
		const collection = this.getAssignments();
		this.setState({busy: true});

		collection.setGrade(grade || assignmentId, userId, (grade || {}).value || '', newLetter)
		.then(
			( ) => {},
			(e) => logger.error( e ? (e.stack || e.message || e) : 'Error')
		)
		.then(()=> this.setState({busy: false}));
	},

	render () {
		//"Final_Grade" only
		const {props: {grade}} = this;
		const {busy} = this.state || {};

		const classes = cx('letter-grade', {busy});

		return (
			<div className={classes}>
				<select ref={this.attachRef} defaultValue={(grade && grade.letter) || ''} onChange={this.onGradeChange}>
					{Grade.getPossibleGradeLetters().map(letter => <option key={letter} value={letter}>{letter}</option>)}
				</select>
			</div>
		);
	}
});

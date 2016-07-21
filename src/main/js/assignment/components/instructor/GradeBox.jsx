import React from 'react';
import cx from 'classnames';

import Grade from 'nti-lib-interfaces/lib/models/courses/Grade';
import {PropType as NTIID} from 'nti-lib-ntiids';
import Logger from 'nti-util-logger';

import {Mixins} from 'nti-web-commons';

import AssignmentsAccessor from '../../mixins/AssignmentCollectionAccessor';

const logger = Logger.get('assignment:components:instructor:GradeBox');

export default React.createClass({
	displayName: 'GradeBox',
	mixins: [AssignmentsAccessor, Mixins.ItemChanges],

	propTypes: {
		grade: React.PropTypes.object,
		userId: React.PropTypes.string.isRequired,
		assignmentId: NTIID.isRequired,
		showLetter: React.PropTypes.bool
	},


	componentWillMount () {
		this.onItemChanged();
	},


	componentWillReceiveProps (nextProps) {
		const {grade: newGrade} = nextProps;
		const {grade: oldGrade} = this.props;

		if (oldGrade !== newGrade) {
			this.onItemChanged(nextProps);
		}
	},


	getInitialState () {
		return {
			value: ''
		};
	},


	getItem (props = this.props) { return props.grade; },


	onItemChanged (props = this.props) {
		const {value = ''} = props.grade || {};
		this.setState({value});
	},


	onFocus (e) {
		e.target.select();
	},


	onBlur (e) {
		const value = e.target.value.trim();
		this.maybeSetGrade(value);
	},


	onChange (e) {
		const value = e.target.value.trim();

		if (this.state.busy) {
			e.preventDefault();
			e.stopPropagation();
			return;
		}

		this.setState({value});

		clearTimeout(this.timerGradeChanging);
		this.timerGradeChanging = setTimeout(()=> this.maybeSetGrade(value), 1000);
	},

	onLetterChange (e) {
		const {value} = this.state;
		const letter = e.target.value;
		this.maybeSetGrade(value, letter);
	},


	maybeSetGrade (newValue, newLetter) {
		const {assignmentId, userId, grade} = this.props;
		const collection = this.getAssignments();
		const currentValue = grade && grade.value;
		const currentLetter = grade && grade.letter;

		if (currentValue === newValue && (!newLetter || currentLetter === newLetter)) {
			return;
		}

		this.setState({busy: true});
		collection.setGrade(grade || assignmentId, userId, newValue, newLetter)
			.then(
				( ) => logger.debug('Success'),
				(e) => logger.error( e ? (e.stack || e.message || e) : 'Error')
			)
			.then(()=> this.setState({busy: false}));
	},


	render () {
		const {grade, showLetter} = this.props;
		const {busy, value} = this.state;
		return (
			<div className={cx('grade-box', {busy, letter: showLetter})}>
				<input
					value={value}
					onBlur={this.onBlur}
					onChange={this.onChange}
					onFocus={this.onFocus}
					/>
				{showLetter &&
					(<select defaultValue={(grade && grade.letter) || ''} onChange={this.onLetterChange}>
						{Grade.getPossibleGradeLetters().map(letter => <option key={letter} value={letter}>{letter}</option>)}
					</select>)
				}
			</div>
		);
	}
});

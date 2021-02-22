import './GradeBox.scss';
import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { decorate, isEmpty } from '@nti/lib-commons';
import { Models } from '@nti/lib-interfaces';
import { PropType as NTIID } from '@nti/lib-ntiids';
import Logger from '@nti/util-logger';
import { HOC } from '@nti/web-commons';

import Assignments from '../bindings/Assignments';

const logger = Logger.get('assignment:components:instructor:GradeBox');

class GradeBox extends React.Component {
	static propTypes = {
		grade: PropTypes.object,
		userId: PropTypes.string.isRequired,
		assignmentId: NTIID.isRequired,
		showLetter: PropTypes.bool,
		assignments: PropTypes.arrayOf(PropTypes.object),
		course: PropTypes.object,
	};

	static getItem(props = this.props) {
		return props.grade;
	}

	state = {
		value: '',
	};

	componentDidMount() {
		this.onItemChanged();
	}

	componentDidUpdate(prevProps) {
		const { grade: newGrade } = this.props;
		const { grade: oldGrade } = prevProps;

		if (oldGrade !== newGrade) {
			this.onItemChanged(newGrade);
		}
	}

	onItemChanged = (grade = this.props.grade) => {
		const value = grade && grade.getValue();

		this.setState({ value: value || '' });
	};

	onFocus = e => {
		e.target.select();
	};

	onBlur = e => {
		const value = e.target.value.trim();
		this.maybeSetGrade(value);
	};

	onChange = e => {
		const value = e.target.value.trim();

		if (this.state.busy) {
			e.preventDefault();
			e.stopPropagation();
			return;
		}

		this.setState({ value });

		clearTimeout(this.timerGradeChanging);
		this.timerGradeChanging = setTimeout(
			() => this.maybeSetGrade(value),
			1000
		);
	};

	onLetterChange = e => {
		const { value } = this.state;
		const letter = e.target.value;
		this.maybeSetGrade(value, letter);
	};

	maybeSetGrade(newValue, newLetter) {
		const {
			assignments: collection,
			assignmentId,
			userId,
			grade,
		} = this.props;
		const currentValue = grade && grade.value;
		const currentLetter = grade && grade.letter;

		if (
			currentValue === newValue ||
			(isEmpty(currentValue) &&
				isEmpty(newValue) &&
				(!newLetter || currentLetter === newLetter))
		) {
			return;
		}

		this.setState({ busy: true });
		collection
			.setGrade(grade || assignmentId, userId, newValue, newLetter)
			.then(
				() => logger.debug('Success'),
				e => logger.error(e ? e.stack || e.message || e : 'Error')
			)
			.then(() => this.setState({ busy: false }));
	}

	render() {
		const { grade, showLetter } = this.props;
		const { busy, value } = this.state;
		return (
			<div className={cx('grade-box', { busy, letter: showLetter })}>
				<input
					value={value}
					onBlur={this.onBlur}
					onChange={this.onChange}
					onFocus={this.onFocus}
				/>
				{showLetter && (
					<select
						defaultValue={(grade && grade.letter) || ''}
						onChange={this.onLetterChange}
					>
						{Models.courses.Grade.getPossibleGradeLetters().map(
							letter => (
								<option key={letter} value={letter}>
									{letter}
								</option>
							)
						)}
					</select>
				)}
			</div>
		);
	}
}

export default decorate(GradeBox, [
	Assignments.connect,
	HOC.ItemChanges.compose,
]);

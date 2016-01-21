import React from 'react';
import cx from 'classnames';

import {PropType as NTIID} from 'nti-lib-ntiids';

import ItemChanges from 'common/mixins/ItemChanges';

import AssignmentsAccessor from '../../mixins/AssignmentCollectionAccessor';

export default React.createClass({
	displayName: 'GradeBox',
	mixins: [AssignmentsAccessor, ItemChanges],

	propTypes: {
		grade: React.PropTypes.object,

		userId: React.PropTypes.string.isRequired,

		assignmentId: NTIID.isRequired
	},


	componentWillMount () {
		this.onItemChanged();
	},


	componentWillReceiveProps (nextProps) {
		const {grade: newGrade} = nextProps;
		const {grade: oldGrade} = this.props;

		if (!oldGrade && newGrade) {
			console.log('Got new Grade!', nextProps.grade.value);
		}

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


	onKeyDown (e) {
		console.log(e.key);
	},


	maybeSetGrade (newValue) {
		const {assignmentId, userId, grade} = this.props;
		const collection = this.getAssignments();
		const currentValue = grade && grade.value;

		if (currentValue === newValue || (!currentValue && !newValue)) {
			return;
		}

		this.setState({busy: true});
		collection.setGrade(grade || assignmentId, userId, newValue)
			.then(
				( ) => console.log('Success'),
				(e) => console.error( e ? (e.stack || e.message || e) : 'Error')
			)
			.then(()=> this.setState({busy: false}));
	},


	render () {
		const {busy, value} = this.state;
		return (
			<input className={cx('grade-box', {busy})}
				value={value}
				onBlur={this.onBlur}
				onChange={this.onChange}
				onFocus={this.onFocus}
				onKeyDown={this.onKeyDown}
				/>
		);
	}
});

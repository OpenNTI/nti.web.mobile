import React from 'react';
import emptyFunction from 'fbjs/lib/emptyFunction';

import cx from 'classnames';

import {getModel} from 'nti.lib.interfaces';

import DateTime from 'common/components/DateTime';

import {scoped} from 'common/locale';

import {getEventTarget} from 'nti.lib.dom';

import moment from 'moment';

const toUnitString = scoped('UNITS');
const toUnitSingularString = scoped('UNITS.SINGULARS');

const Assignment = getModel('assessment.assignment');
const HistoryItem = getModel('assessment.assignmenthistoryitem');

export default React.createClass({
	displayName: 'AssignmentStatusLabel',

	propTypes: {
		assignment: React.PropTypes.instanceOf(Assignment),
		historyItem: React.PropTypes.instanceOf(HistoryItem),

		showTimeWithDate: React.PropTypes.bool
	},

	getInitialState () {
		return {
			showDetail: null
		};
	},


	isAssigned () {
		const now = new Date();
		const {props: {assignment: a}} = this;
		return a.getAssignedDate() <= now;
	},


	isOverDue () {
		const date = this.getCompletedDateTime() || new Date();
		const a = this.props.assignment;
		return a.isLate(date);
	},


	isOverTime () {
		const {props: {assignment: a}} = this;
		return Boolean(a.isOverTime && a.isOverTime());
	},


	isDueToday () {
		const {props: {assignment: a}} = this;
		return moment(a.getDueDate()).isSame(new Date(), 'day');
	},


	isSubmitted () {
		const {props: {historyItem}} = this;
		return historyItem && historyItem.isSubmitted();
	},


	isExcused () {
		const {props: {historyItem: i}} = this;
		return i && i.isGradeExcused && i.isGradeExcused();
	},


	getCompletedDateTime () {
		const {props: {historyItem: i}} = this;
		return i && i.isSubmitted() && i.getCreatedTime();
	},


	getDuration () {
		const {props: {assignment: a}} = this;
		return a.getDuration && a.getDuration();
	},


	getMaximumTimeAllowed () {
		let a = this.props.assignment;
		return a.getMaximumTimeAllowed && a.getMaximumTimeAllowed();
	},


	getStartTime () {
		let a = this.props.assignment;
		return a.getStartTime && a.getStartTime();
	},


	getTimeRemaining () {
		let max = this.getMaximumTimeAllowed();
		return max - (new Date() - this.getStartTime());
	},


	getDifferenceBetweenSubmittedAndDue () {
		let submitted = this.getCompletedDateTime();
		let due = this.props.assignment.getDueDate();
		return Math.abs(due - submitted);
	},


	getDifferenceBetweenTimeSpentAndMaxTime () {
		let max = this.getMaximumTimeAllowed();
		let dur = this.getDuration();
		return Math.abs(max - dur);
	},


	getNaturalDuration (duration, accuracy, singular) {
		let d = new moment.duration(duration);

		let out = [];
		let toString = singular ? toUnitSingularString : toUnitString;

		function maybeAdd (unit) {
			let u = d.get(unit);
			if (u > 0 && (!accuracy || out.length < accuracy)) {
				out.push(toString(unit, {count: u}));
			}
		}

		maybeAdd('years');
		maybeAdd('months');
		maybeAdd('weeks');
		maybeAdd('days');
		maybeAdd('hours');
		maybeAdd('minutes');
		maybeAdd('seconds');

		if (out.length === 0) {
			out.push(toString('seconds', {count: 0}));
		}

		return out.join(', ');
	},


	onCloseDetail (e) {
		if (e) {
			e.preventDefault();
			e.stopPropagation();
		}

		this.setState({showDetail: null});
	},


	onShowOverdueDetail (e) {
		if (e) {
			e.preventDefault();
			e.stopPropagation();
		}

		let c = (this.state.showDetail || {}).over;

		//Change the state to show detail (or toggle it off if its already on)
		this.setState({
			showDetail: c === 'overdue' ? void 0 : {over: 'overdue'}
		});
	},


	onShowOvertimeDetail (e) {
		if (e) {
			e.preventDefault();
			e.stopPropagation();
		}

		let c = (this.state.showDetail || {}).over;

		//Change the state to show detail (or toggle it off if its already on)
		this.setState({
			showDetail: c === 'overtime' ? void 0 : {over: 'overtime'}
		});
	},


	onShowStatusDetail (e) {
		let s = this.state;


		if (this.isSubmitted() && getEventTarget(e, 'time, .overdue, .overtime')) {
			return;
		}


		if (e) {
			e.preventDefault();
			e.stopPropagation();
		}

		//Change the state to show detail (or toggle it off if its already on)
		this.setState({
			showDetail: s.showDetail === 'detail' ? void 0 : 'detail'
		});
	},


	componentWillMount () {
		this.getDifferenceBetween = {
			overdue: this.getDifferenceBetweenSubmittedAndDue,
			overtime: this.getDifferenceBetweenTimeSpentAndMaxTime
		};
	},


	render () {
		const {props: {showTimeWithDate, assignment}} = this;

		const complete = this.isSubmitted();
		const available =  this.isAssigned();

		const submittable = assignment.canBeSubmitted();

		const date = this.getCompletedDateTime() || assignment.getDueDate();

		const text = complete
			? (assignment.isNonSubmit() ? 'Graded' : 'Completed')
			: available
				? 'Due'
				: 'Available on';

		const infoClasses = cx('info-part', text.toLowerCase(), {
			'non-submit': assignment.isNonSubmit(),
			'due-today': !complete && this.isDueToday(),
			'overdue': this.isOverDue() && submittable,
			'late': this.isOverDue() && !assignment.isNonSubmit() && !submittable,
			'overtime': submittable && this.isOverTime(),
			'not-available': !available
		});

		const dateFormat = showTimeWithDate
			? 'dddd, MMMM D h:mm A z'
			: 'dddd, MMMM D';

		if (!date) {
			return null;//no date? we have nothing to show
		}

		return (
			<div className="assignment status-label-wrapper">
				<h6 className="assignment status-label">
					{assignment.isTimed && this.renderTimeInfo()}
					<span className={infoClasses}>
						<span className="state" onClick={this.onShowStatusDetail}>{text}</span>
						<span className="over">
							(
							<span className="overtime" onClick={this.onShowOvertimeDetail}>Overtime</span>
							<span className="overdue" onClick={this.onShowOverdueDetail}>Overdue</span>
							)
						</span>
						<DateTime
							onClick={this.onShowStatusDetail}
							date={date}
							showToday={!complete/*only show today if we aren't submitted*/}
							format={dateFormat}
							todayText="Today!"/>
						{this.isExcused() && (
							<span className="excused">Excused Grade</span>
						)}
					</span>
				</h6>
				{this.renderDetail()}
			</div>
		);
	},


	renderDetail () {
		let isDueToday = this.isDueToday();
		let isSubmitted = this.isSubmitted();
		let date = this.getCompletedDateTime();
		let detail = this.state.showDetail;
		let over = detail && detail.over;
		let dur;


		if (!detail || (!isSubmitted && !isDueToday)) {
			return;
		}


		dur = (this.getDifferenceBetween[over] || emptyFunction)();

		return (
			<div className="assignment status-label-tip" onClick={this.onCloseDetail}>
			<div className="message">
				{ !isSubmitted ? (
					<span className="part">{this.getNaturalDuration(this.getTimeRemaining(), 2)} Remaining</span>

				) :

				[over && (
					<span className="part">{this.getNaturalDuration(dur, 1)} {over}</span>
				), (
					<span className="part"><DateTime date={date} format="[Submitted at] h:mm A MM/DD/YYYY"/></span>
				)]}
			</div>
			</div>
		);
	},


	renderTimeInfo () {
		let baseCls = 'info-part time-limit';
		let duration = this.getDuration();
		let maxtime = this.getMaximumTimeAllowed();

		let time = this.getNaturalDuration(duration || maxtime, 2, !duration);

		if (duration) {
			return (
				<span className={cx(baseCls, this.isOverTime() ? 'overtime' : 'ontime')}>{time}</span>
			);
		}

		return (<span className={baseCls}>{time} Time Limit</span>);
	}
});

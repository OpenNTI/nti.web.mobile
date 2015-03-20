'use strict';

var React = require('react');
var emptyFunction = require('react/lib/emptyFunction');

var DateTime = require('common/components/DateTime');

var toUnitString = require('common/locale').scoped('UNITS');
var toUnitSingularString = require('common/locale').scoped('UNITS.SINGULARS');
var getEventTarget = require('nti.dom/lib/geteventtarget');

var moment = require('moment');

module.exports = React.createClass({
	displayName: 'AssignmentStatusLabel',


	getInitialState: function() {
		return {
			showDetail: null
		};
	},


	isOverDue: function () {
		var date = this.getCompletedDateTime() || new Date();
		var a = this.props.assignment;
		return a.isLate(date);
	},


	isOverTime: function () {
		var a = this.props.assignment;
		return Boolean(a.isOverTime && a.isOverTime());
	},


	isDueToday: function () {
		var a = this.props.assignment;
		return moment(a.getDueDate()).isSame(new Date(), 'day');
	},


	isSubmitted: function () {
		return this.props.historyItem && this.props.historyItem.isSubmitted();
	},


	isExcused () {
		var i = this.props.historyItem;
		return i && i.isGradeExcused();
	},


	getCompletedDateTime: function () {
		var i = this.props.historyItem;

		return i && i.isSubmitted() && i.getCreatedTime();
	},


	getDuration: function () {
		var a = this.props.assignment;
		return a.getDuration && a.getDuration();
	},


	getMaximumTimeAllowed: function () {
		var a = this.props.assignment;
		return a.getMaximumTimeAllowed && a.getMaximumTimeAllowed();
	},


	getStartTime: function () {
		var a = this.props.assignment;
		return a.getStartTime && a.getStartTime();
	},


	getTimeRemaining: function () {
		var max = this.getMaximumTimeAllowed();
		return max - (new Date() - this.getStartTime());
	},


	getDifferenceBetweenSubmittedAndDue: function () {
		var submitted = this.getCompletedDateTime();
		var due = this.props.assignment.getDueDate();
		return Math.abs(due - submitted);
	},


	getDifferenceBetweenTimeSpentAndMaxTime: function () {
		var max = this.getMaximumTimeAllowed();
		var dur = this.getDuration();
		return Math.abs(max - dur);
	},


	getNaturalDuration: function (duration, accuracy, singular) {
		var d = new moment.duration(duration);

		var out = [];
		var toString = singular ? toUnitSingularString : toUnitString;

		function maybeAdd(unit) {
			var u = d.get(unit);
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

		if (out.length===0) {
			out.push(toString('seconds',{count:0}));
		}

		return out.join(', ');
	},


	onCloseDetail: function (e) {
		if (e) {
			e.preventDefault();
			e.stopPropagation();
		}

		this.setState({showDetail: null});
	},


	onShowOverdueDetail: function (e) {
		if (e) {
			e.preventDefault();
			e.stopPropagation();
		}

		var c = (this.state.showDetail || {}).over;

		//Change the state to show detail (or toggle it off if its already on)
		this.setState({
			showDetail: c==='overdue'? void 0 : {over: 'overdue'}
		});
	},


	onShowOvertimeDetail: function (e) {
		if (e) {
			e.preventDefault();
			e.stopPropagation();
		}

		var c = (this.state.showDetail || {}).over;

		//Change the state to show detail (or toggle it off if its already on)
		this.setState({
			showDetail: c==='overtime'? void 0 : {over: 'overtime'}
		});
	},


	onShowStatusDetail: function (e) {
		var s = this.state;


		if (this.isSubmitted() && getEventTarget(e, 'time, .overdue, .overtime')) {
			return;
		}


		if (e) {
			e.preventDefault();
			e.stopPropagation();
		}

		//Change the state to show detail (or toggle it off if its already on)
		this.setState({
			showDetail: s.showDetail==='detail'? void 0 : 'detail'
		});
	},


	componentWillMount: function() {
		this.getDifferenceBetween = {
			overdue: this.getDifferenceBetweenSubmittedAndDue,
			overtime: this.getDifferenceBetweenTimeSpentAndMaxTime
		};
	},


	render: function() {
		var assignment = this.props.assignment;
		var complete = this.isSubmitted();

		var submittable = assignment.canBeSubmitted();

		var date = this.getCompletedDateTime() || assignment.getDueDate();

		var dueToday = (!complete && this.isDueToday()) ? 'due-today ' : '';
		var overdue = this.isOverDue() ? (submittable ? 'overdue ' : 'late ') : '';
		var overtime = submittable && this.isOverTime() ? 'overtime ' : '';

		var text = complete ? (assignment.isNonSubmit() ? 'Graded' : 'Completed') : 'Due';

		return (
			<div className="assignment status-label-wrapper">
				<h6 className="assignment status-label">
					{assignment.isTimed && this.renderTimeInfo()}
					<span className={'info-part ' + dueToday + overdue + overtime + text.toLowerCase()}>
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
							format="dddd, MMMM D"
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


	renderDetail: function () {
		var isDueToday = this.isDueToday();
		var isSubmitted = this.isSubmitted();
		var date = this.getCompletedDateTime();
		var detail = this.state.showDetail;
		var over = detail && detail.over;
		var dur;


		if (!detail || (!isSubmitted && !isDueToday)) {
			return;
		}


		dur = (this.getDifferenceBetween[over] || emptyFunction)();

		return (
			<div className="assignment status-label-tip" onClick={this.onCloseDetail}>
			<div className="message">
				{!isSubmitted ? (
					<span className="part">{this.getNaturalDuration(this.getTimeRemaining(), 2)} Remaining</span>

				):

				[over && (
					<span className="part">{this.getNaturalDuration(dur, 1)} {over}</span>
				),(
					<span className="part"><DateTime date={date} format="[Submitted at] h:mm A MM/DD/YYYY"/></span>
				)]}
			</div>
			</div>
		);
	},


	renderTimeInfo: function () {
		var baseCls = 'info-part time-limit ';
		var duration = this.getDuration();
		var maxtime = this.getMaximumTimeAllowed();

		var time = this.getNaturalDuration(duration || maxtime, duration ? 2 : 1, !duration);

		if (duration) {
			return (
				<span className={baseCls + (this.isOverTime() ? 'overtime' : 'ontime')}>{time}</span>
			);
		}

		return (<span className={baseCls}>{time} Time Limit</span>);
	}
});

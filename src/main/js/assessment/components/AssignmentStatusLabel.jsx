/** @jsx React.DOM */
'use strict';

var React = require('react/addons');

var Store = require('../Store');

var DateTime = require('common/components/DateTime');

var toUnitString = require('common/locale').scoped('UNITS');
var toUnitSingularString = require('common/locale').scoped('UNITS.SINGULARS');

var moment = require('moment');

module.exports = React.createClass({
	displayName: 'AssignmentStatusLabel',


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


	getCompletedDateTime: function () {
		var i = this.props.historyItem;
		return i && i.getCreatedTime();
	},


	getDuration: function () {
		var a = this.props.assignment;
		return a.getDuration && a.getDuration();
	},


	getMaximumTimeAllowed: function () {
		var a = this.props.assignment;
		return a.getMaximumTimeAllowed && a.getMaximumTimeAllowed();
	},


	getNaturalDuration: function (duration, singular, accuracy) {
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

		return out.join(', ');
	},


	render: function() {
		var assignment = this.props.assignment;
		var complete = Store.isSubmitted(assignment);

		var date = this.getCompletedDateTime() || new Date();

		var dueToday = (!complete && this.isDueToday()) ? 'due-today ' : '';
		var overdue = this.isOverDue() ? 'overdue ' : '';
		var overtime = this.isOverTime() ? 'overtime ' : '';

		var text = complete ? 'Completed' : 'Due';

		return (
			<div>
				<h6 className="assignment status-label">
					{assignment.isTimed && this.renderTimeInfo()}
					<span className={'info-part ' + dueToday + overdue + overtime + text.toLowerCase()}>
						<span className="state">{text}</span>
						<span className="over">
							(
							<span className="overtime">Overtime</span>
							<span className="overdue">Overdue</span>
							)
						</span>
						<DateTime date={date} showToday={true} format="dddd, MMMM D" todayText="Today!"/>
					</span>
				</h6>
			</div>
		);
		/*
		<div className="label-tip">
			<span>
				<DateTime date={date} format="[Submitted at] h:mm A MM/DD/YYYY"/>
			</span>
		</div>
		*/
	},


	renderTimeInfo: function () {
		var baseCls = 'info-part time-limit ';
		var duration = this.getDuration();
		var maxtime = this.getMaximumTimeAllowed();

		var time = this.getNaturalDuration(duration || maxtime, !duration, duration ? 2 : 1);

		if (duration) {
			return (
				<span className={baseCls + (this.isOverTime() ? 'overtime' : 'ontime')}>{time}</span>
			);
		}

		return (<span className={baseCls}>{time} Time Limit</span>);
	}
});

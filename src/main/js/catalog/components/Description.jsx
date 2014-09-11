/** @jsx React.DOM */
'use strict';

var React = require('react/addons');
var moment = require('moment');
var isEmpty = require('dataserverinterface/utils/isempty');

var locale = require('../../common/locale');
function _t(key, options) { return locale('COURSE_INFO.' + key, options); }

var isOpenEnrolled = RegExp.prototype.test.bind(/open/i);


var OpenEnrolledMessage = React.createClass({
	render: function() {
		return (
			<div className="open">
				{_t('OpenEnrolled')} <span className="red">{_t('OpenEnrolledIsNotForCredit')}</span>
			</div>
		);
	}
});


var CreditHours = React.createClass({
	render: function() {
		var credits = this.props.credit || [];
		var hours = (credits[0] || {}).Hours;

		return (
			<div className="enroll-for-credit">
			{/*
				{_t('Credit.x_units', { count: hours  })} {_t('Credit.available')}<br />
			*/}
				{credits.map(function(credit) {
					var e = credit.Enrollment || {};
					return (
						<div className="credit">
							{_t('Credit.x_units', { count: credit.Hours  })} {_t('Credit.available')}<br />
							<a href={e.url} target="_blank">{e.label}</a>
						</div>
					);
				})}
			</div>
		);
	}
});


var FullyOnline = React.createClass({
	render: function() {
		return (
			<div className="value">
				{_t('OnlyOnline')}
			</div>
		);
	}
});


var Schedule = React.createClass({

	_f: function (d) {
		var date = this.props.startDate.split('T')[0];//YUCK
		date = [date, d].join('T'); //ICK!

		return moment(date).format('h:mm a');
	},

	render: function() {
		var schedule = this.props.schedule;
		return (
			<div className="value">
				<span>{schedule.days.join(' / ')}</span>
				<span className="space"> </span>
				<span>{schedule.times.map(this._f).join(' - ')}</span>
			</div>
		);

	}
});


module.exports = React.createClass({
	displayName: 'Description',

	render: function() {
		var enrollmentStatus = this.props.enrollmentStatus || 'None';
		var EnrollmentMessage = isOpenEnrolled(enrollmentStatus) ?
				OpenEnrolledMessage :
				React.DOM.div;

		var entry = this.props.entry;
		var prerequisites = entry.Prerequisites;
		if (isEmpty(prerequisites)) {
			prerequisites = [_t('NoPrerequisites')];
		}

		return (
			<div>
				<div className="row">
					<div className="cell small-12 columns">{entry.Description}</div>
				</div>
				<div className="row">

					<div className="cell small-6 columns">
						<div className="label">Prerequisites</div>
						<div className="value">
						{(prerequisites || []).map(function(_) {
							return (<div>{_}</div>);
						})}
						</div>
					</div>

					<div className="cell small-6 columns">
						<div className="label">Hours</div>
						<div className={'value ' + enrollmentStatus}>

							{!isEmpty(entry.Credit)? <CreditHours credit={entry.Credit} /> : null}

							<EnrollmentMessage/>
						</div>
					</div>

				</div>
				<div className="row">

					<div className="cell small-6 columns">
						<div className="label">{entry.ProviderUniqueID}</div>
						<div className="value">{entry.Title}</div>
					</div>

					<div className="cell small-6 columns">
						<div className="label">{_t('SchoolLabel')}</div>
						<div className="value">{entry.ProviderDepartmentTitle}</div>
					</div>

				</div>
				<div className="row">

					<div className="cell medium-4 columns">
						<div className="label">{_t('StartDate')}</div>
						<div className="value">{moment(entry.StateDate).format('LL')}</div>
					</div>

					<div className="cell medium-8 columns">

						<div className="row">
							<div className="cell small-4 columns">
								<div className="label">{_t('Duration')}</div>
								<div className="value">
									{moment.duration(entry.Duration).asWeeks()} {_t('DurationUnits')}
								</div>
							</div>

							<div className="cell small-8 columns">
								<div className="label">{_t('Days')}</div>
								{isEmpty(entry.Schedule && entry.Schedule.days)?
									<FullyOnline/> :
									<Schedule schedule={entry.Schedule} startDate={entry.StartDate} />}
							</div>

						</div>
					</div>
				</div>
			</div>
		);
	}

});

'use strict';

var React = require('react/addons');
var moment = require('moment');
var isEmpty = require('dataserverinterface/utils/isempty');

var locale = require('common/locale').translate;
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
		var keyPrefix = this.props.entry + '-credit-';
		var credits = this.props.credit || [];
		//var hours = (credits[0] || {}).Hours;

		return (
			<div className="enroll-for-credit">
			{/*
			{locale('UNITS.credits', { count: hours  })} {_t('CREDIT.available')}<br />
			*/}
				{credits.map(function(credit, i) {
					var e = credit.Enrollment || {};
					return (
						<div className="credit" key={keyPrefix + i}>
					{locale('UNITS.credits', { count: credit.Hours  })} {_t('CREDIT.available')}<br />
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
				OpenEnrolledMessage : 'div';

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
					<div className="cell small-12 columns">
						<table className="small-12">
							<tbody>
								<tr>
									<td>{entry.ProviderUniqueID}</td>
									<td>{entry.Title}</td>
								</tr>
								<tr>
									<td>{_t('SchoolLabel')}</td>
									<td>{entry.ProviderDepartmentTitle}</td>
								</tr>
								<tr>
									<td>Prerequisites</td>
									<td>
										{(prerequisites || []).map(function(_) {
											return (<div key={_}>{_}</div>);
										})}
									</td>
								</tr>
								<tr>
									<td>Hours</td>
									<td>
										{!isEmpty(entry.Credit)?
											<CreditHours credit={entry.Credit} entry={entry.getID()} /> : null}
										<EnrollmentMessage/>
									</td>
								</tr>
								<tr>
									<td>{_t('StartDate')}</td>
									<td>{moment(entry.StartDate).format('LL')}</td>
								</tr>
								<tr>
									<td>{_t('Duration')}</td>
									<td>
										{Math.floor(moment.duration(entry.Duration).asWeeks())} {_t('DurationUnits')}
									</td>
								</tr>
								<tr>
									<td>{_t('Days')}</td>
									<td>
										{isEmpty(entry.Schedule && entry.Schedule.days)?
											<FullyOnline/> :
											<Schedule schedule={entry.Schedule} startDate={entry.StartDate} />
										}
									</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
			</div>
		);
	}

});

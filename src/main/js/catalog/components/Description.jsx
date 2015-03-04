import React from 'react';
import moment from 'moment';
import isEmpty from 'dataserverinterface/utils/isempty';
import {scoped, translate as locale} from 'common/locale';

const _t = scoped('COURSE.INFO');

const isOpenEnrolled = RegExp.prototype.test.bind(/open/i);

const OpenEnrolledMessage = React.createClass({
	render () {
		return (
			<div className="open">
				{_t('OpenEnrolled')} <span className="red">{_t('OpenEnrolledIsNotForCredit')}</span>
			</div>
		);
	}
});


const CreditHours = React.createClass({
	render () {
		var keyPrefix = this.props.entry + '-credit-';
		var credits = this.props.credit || [];
		//var hours = (credits[0] || {}).Hours;

		return (
			<div className="enroll-for-credit">
				{/*{locale('UNITS.credits', { count: hours  })} {_t('CREDIT.available')}<br />*/}
				{credits.map((credit, i) => {
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


const FullyOnline = React.createClass({
	render () {
		return (<div className="value">{_t('OnlyOnline')}</div>);
	}
});


const Schedule = React.createClass({

	_f (d) {
		var date = this.props.startDate.split('T')[0];//YUCK
		date = [date, d].join('T'); //ICK!

		return moment(date).format('h:mm a');
	},

	render () {
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


export default React.createClass({
	displayName: 'Description',

	render () {
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
										{(prerequisites || []).map(_ => (<div key={_}>{_}</div>))}
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

import React from 'react';
import moment from 'moment';
import isEmpty from 'nti.lib.interfaces/utils/isempty';
import locale, {scoped} from 'common/locale';

const t = scoped('COURSE.INFO');

const isOpenEnrolled = RegExp.prototype.test.bind(/open/i);

const OpenEnrolledMessage = React.createClass({
	render () {
		return (
			<div className="open">
				{t('OpenEnrolled')} <span className="red">{t('OpenEnrolledIsNotForCredit')}</span>
			</div>
		);
	}
});


const CreditHours = React.createClass({
	render () {
		let keyPrefix = this.props.entry + '-credit-';
		let credits = this.props.credit || [];
		//let hours = (credits[0] || {}).Hours;

		return (
			<div className="enroll-for-credit">
				{/*{locale('UNITS.credits', { count: hours  })} {t('CREDIT.available')}<br />*/}
				{credits.map((credit, i) => {
					let e = credit.Enrollment || {};
					return (
						<div className="credit" key={keyPrefix + i}>
							{locale('UNITS.credits', { count: credit.Hours })} {t('CREDIT.available')}<br />
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
		return (<div className="value">{t('OnlyOnline')}</div>);
	}
});


const Schedule = React.createClass({

	format (d) {
		let date = this.props.startDate.split('T')[0];//YUCK
		date = [date, d].join('T'); //ICK!

		return moment(date).format('h:mm a');
	},

	render () {
		let schedule = this.props.schedule;
		return (
			<div className="value">
				<span>{schedule.days.join(' / ')}</span>
				<span className="space"> </span>
				<span>{schedule.times.map(this.format).join(' - ')}</span>
			</div>
		);

	}
});


export default React.createClass({
	displayName: 'Description',

	render () {
		let enrollmentStatus = this.props.enrollmentStatus || 'None';
		let EnrollmentMessage = isOpenEnrolled(enrollmentStatus) ?
				OpenEnrolledMessage : 'div';

		let entry = this.props.entry;
		let prerequisites = entry.Prerequisites;
		if (isEmpty(prerequisites)) {
			prerequisites = [t('NoPrerequisites')];
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
									<td>{t('SchoolLabel')}</td>
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
										{!isEmpty(entry.Credit) ?
											<CreditHours credit={entry.Credit} entry={entry.getID()} /> : null}
										<EnrollmentMessage/>
									</td>
								</tr>
								<tr>
									<td>{t('StartDate')}</td>
									<td>{moment(entry.StartDate).format('LL')}</td>
								</tr>
								<tr>
									<td>{t('Duration')}</td>
									<td>
										{Math.floor(moment.duration(entry.Duration).asWeeks())} {t('DurationUnits')}
									</td>
								</tr>
								<tr>
									<td>{t('Days')}</td>
									<td>
										{isEmpty(entry.Schedule && entry.Schedule.days) ?
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

import React from 'react';
import moment from 'moment';
import isEmpty from 'nti.lib.interfaces/utils/isempty';
import {scoped} from 'common/locale';

import OpenEnrolledMessage from './OpenEnrolledMessage';
import CreditHours from './CreditHours';
import FullyOnline from './FullyOnline';
import Schedule from './Schedule';

const t = scoped('COURSE.INFO');

const isOpenEnrolled = RegExp.prototype.test.bind(/open/i);

export default React.createClass({
	displayName: 'Description',

	propTypes: {
		enrollmentStatus: React.PropTypes.string,

		entry: React.PropTypes.object.isRequired
	},

	render () {
		let {enrollmentStatus = 'None'} = this.props;
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

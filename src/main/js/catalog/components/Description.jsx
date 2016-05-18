import React from 'react';
import moment from 'moment';
import isEmpty from 'isempty';
import {scoped} from 'nti-lib-locale';

import OpenEnrolledMessage from './OpenEnrolledMessage';
import CreditHours from './CreditHours';
import FullyOnline from './FullyOnline';
import Schedule from './Schedule';

const t = scoped('COURSE.INFO');

const isOpenEnrolled = RegExp.prototype.test.bind(/open/i);

export default function Description ({entry, enrollmentStatus = 'None'}) {
	let EnrollmentMessage = isOpenEnrolled(enrollmentStatus) ?
			OpenEnrolledMessage : 'div';

	let prerequisites = entry.Prerequisites;
	if (isEmpty(prerequisites)) {
		prerequisites = [t('NoPrerequisites')];
	}

	let weeks = Math.floor(moment.duration(entry.Duration).asWeeks());

	return (
		<div>

			<div className="course-description">{entry.Description}</div>

			<div className="course-details">
				<table>
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
								{(prerequisites || []).map((x, i) => (<div key={x.id || i}>{x.title}</div>))}
							</td>
						</tr>
						{EnrollmentMessage !== 'div' || !isEmpty(entry.Credit) ? (
							<tr>
								<td>{t('CreditHours')}</td>
								<td>
									{!isEmpty(entry.Credit) ?
										<CreditHours credit={entry.Credit} entry={entry.getID()} /> : null}
									<EnrollmentMessage/>
								</td>
							</tr>
						) : (
							<tr/>
						)}
						<tr>
							<td>{t('StartDate')}</td>
							<td>{moment(entry.StartDate).format('LL')}</td>
						</tr>
						{weeks > 0 && (
						<tr>
							<td>{t('Duration')}</td>
							<td>
								{weeks} {t('DurationUnits')}
							</td>
						</tr>
						)}
						<tr>
							<td>{t('DaysAndTimes')}</td>
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
	);
}

Description.propTypes = {
	enrollmentStatus: React.PropTypes.string,
	entry: React.PropTypes.object.isRequired
};

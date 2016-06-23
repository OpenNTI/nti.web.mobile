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
		prerequisites = [{title: t('NoPrerequisites')}];
	}

	let weeks = Math.floor(moment.duration(entry.Duration).asWeeks());

	return (
		<div>

			<div className="course-description">{entry.Description}</div>

			<div className="course-details">

				<dl>
					<dt>{entry.ProviderUniqueID}</dt>
					<dd>{entry.Title}</dd>
				</dl>
				<dl>
					<dt>{t('SchoolLabel')}</dt>
					<dd>{entry.ProviderDepartmentTitle}</dd>
				</dl>
				<dl>
					<dt>Prerequisites</dt>
					{(prerequisites || []).map((x, i) => (<dd key={x.id || i}>{x.title}</dd>))}
				</dl>
				{EnrollmentMessage !== 'div' || !isEmpty(entry.Credit) && (
					<dl>
						<dt>{t('CreditHours')}</dt>
						<dd>
							{!isEmpty(entry.Credit) ?
								<CreditHours credit={entry.Credit} entry={entry.getID()} /> : null}
							<EnrollmentMessage/>
						</dd>
					</dl>
				)}
				<div className="cols">
					<dl>
						<dt>{t('StartDate')}</dt>
						<dd>{moment(entry.StartDate).format('LL')}</dd>
					</dl>
					{weeks > 0 && (
					<dl>
						<dt>{t('Duration')}</dt>
						<dd>
							{weeks} {t('DurationUnits')}
						</dd>
					</dl>
					)}
					<dl>
						<dt>{t('DaysAndTimes')}</dt>
						<dd>
						{isEmpty(entry.Schedule && entry.Schedule.days) ?
							<FullyOnline/> :
							<Schedule schedule={entry.Schedule} startDate={entry.StartDate} />
						}
						</dd>
					</dl>
				</div>
			</div>
		</div>
	);
}

Description.propTypes = {
	enrollmentStatus: React.PropTypes.string,
	entry: React.PropTypes.object.isRequired
};

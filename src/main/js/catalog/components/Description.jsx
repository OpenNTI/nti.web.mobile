import PropTypes from 'prop-types';
import React from 'react';
import moment from 'moment';
import isEmpty from 'isempty';
import {scoped} from 'nti-lib-locale';
import {rawContent} from 'nti-commons';

import OpenEnrolledMessage from './OpenEnrolledMessage';
import CreditHours from './CreditHours';
import FullyOnline from './FullyOnline';
import Schedule from './Schedule';

const t = scoped('COURSE.INFO');

const isOpenEnrolled = RegExp.prototype.test.bind(/open/i);

Description.propTypes = {
	enrollmentStatus: PropTypes.string,
	entry: PropTypes.object.isRequired
};

export default function Description ({entry, enrollmentStatus = 'None'}) {
	let EnrollmentMessage = isOpenEnrolled(enrollmentStatus) ?
		OpenEnrolledMessage : 'div';

	let prerequisites = entry.Prerequisites;
	if (isEmpty(prerequisites)) {
		prerequisites = [{title: t('NoPrerequisites')}];
	}

	let weeks = Math.floor(moment.duration(entry.Duration).asWeeks());

	const desc = !isEmpty(entry.RichDescription)
		? rawContent(entry.RichDescription)
		: {children: entry.Description};

	return (
		<div>

			<div className="course-description" {...desc}/>

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
							{isEmpty(entry.Schedule && entry.Schedule.days) || !entry.StartDate ?
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

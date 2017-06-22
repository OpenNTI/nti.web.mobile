import path from 'path';

import React from 'react';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import {NestableLink as Link, Mixins} from 'nti-web-commons';
import {scoped} from 'nti-lib-locale';
import {getModel, SURVEY_REPORT_LINK} from 'nti-lib-interfaces';
import {encodeForURI} from 'nti-lib-ntiids';

const OutlineNode = getModel('courses.courseoutlinenode');

const t = scoped('UNITS');

export default createReactClass({
	displayName: 'CourseOverviewSurveyReference',
	mixins: [Mixins.NavigatableMixin],

	statics: {
		mimeTest: /surveyref$/i,
		handles (item) {
			return this.mimeTest.test(item.MimeType);
		},

		canRender  (/*item, outlineNode*/) {
			let render = true;
			// let id = item['Target-NTIID'];

			return render;
		}
	},


	propTypes: {
		item: PropTypes.object,
		node: PropTypes.instanceOf(OutlineNode)
	},


	render () {
		const {item} = this.props;
		const questionCount = item.getQuestionCount();
		const report = item.getLink(SURVEY_REPORT_LINK);
		const {isSubmitted: submitted, label = 'No Label', submissions = 0} = item;

		let href = path.join('content', encodeForURI(item['Target-NTIID'])) + '/';

		return (
			<a className="overview-naquestionset overview-survey" href={href}>
				<div className="body">
					<div className="icon icon-survey"/>
					<div className="tally-box">
						<div className="message">{label}</div>
						<div className="tally">
							<div className="stat questions">
								{t('questions', {count: questionCount})}
							</div>
							<div className="stat submissions">{t('submissions', {count: submissions})}</div>
							{submitted && ( <div className="stat submitted">Submitted!</div> )}
							{report && (
								<div className="stat submitted">
									<Link href={report} target="_blank">
										View Report
										<span className="icon-report"/>
									</Link>
								</div>
							)}
						</div>
					</div>
				</div>
			</a>
		);
	}
});

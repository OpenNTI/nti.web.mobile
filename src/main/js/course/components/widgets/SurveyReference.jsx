import React from 'react';
import createReactClass from 'create-react-class';
import path from 'path';

import {NestableLink as Link, Mixins} from 'nti-web-commons';

import t from 'nti-lib-locale';

import {getModel} from 'nti-lib-interfaces';
import {encodeForURI} from 'nti-lib-ntiids';
import {SURVEY_REPORT_LINK} from 'nti-lib-interfaces';

const OutlineNode = getModel('courses.courseoutlinenode');


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
		item: React.PropTypes.object,
		node: React.PropTypes.instanceOf(OutlineNode)
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
								{t('UNITS.questions', {count: questionCount})}
							</div>
							<div className="stat submissions">{t('UNITS.submissions', {count: submissions})}</div>
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

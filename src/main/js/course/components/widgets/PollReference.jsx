import path from 'path';

import React from 'react';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import {Mixins} from 'nti-web-commons';
import {scoped} from 'nti-lib-locale';
import {getModel, ASSESSMENT_HISTORY_LINK} from 'nti-lib-interfaces';
import {encodeForURI} from 'nti-lib-ntiids';

const OutlineNode = getModel('courses.courseoutlinenode');

const isSubmitted = (item) => !!((item || {}).Links || []).find(x=> x.rel === ASSESSMENT_HISTORY_LINK);

const t = scoped('UNITS');

export default createReactClass({
	displayName: 'CourseOverviewPollReference',
	mixins: [Mixins.NavigatableMixin],

	statics: {
		mimeTest: /pollref$/i,
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
		let {item} = this.props;
		let {label = 'No Label', submissions = 0} = item;

		let submitted = isSubmitted(item);

		let href = path.join('content', encodeForURI(item.target || item['Target-NTIID'])) + '/';

		return (
			<a className="overview-survey poll" href={href}>
				<div className="body">
					<div className="icon icon-poll"/>
					<div className="tally-box">
						<div className="message">{label}</div>
						<div className="tally">
							<div className="stat submissions">{t('submissions', {count: submissions})}</div>
							{submitted && ( <div className="stat submitted">Submitted!</div> )}
						</div>
					</div>
				</div>
			</a>
		);
	}
});

import path from 'path';

import React from 'react';

import cx from 'classnames';

import {getModel} from 'nti.lib.interfaces';

import NavigatableMixin from 'common/mixins/NavigatableMixin';

import {encodeForURI} from 'nti.lib.interfaces/utils/ntiids';

const OutlineNode = getModel('courses.courseoutlinenode');

export default React.createClass( {
	displayName: 'CourseOverviewDiscussion',
	mixins: [NavigatableMixin],

	statics: {
		mimeTest: /(surveyref)$/i,
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
		let {item} = this.props;
		let questionCount = item['question-count'];
		let {label} = item;

		let href = path.join('content', encodeForURI(item['Target-NTIID'])) + '/';

		let classList = cx('overview-naquestionset');

		return (
			<a className={classList} href={href}>
				<div className="body">
					<div className="tally-box">
						<div className="message">{label}</div>
						<div className="tally">
							<div className="stat questions">{questionCount} questions</div>
						</div>
					</div>
				</div>
			</a>
		);
	}
});

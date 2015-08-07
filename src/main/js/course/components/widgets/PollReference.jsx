import path from 'path';
import React from 'react';

import NavigatableMixin from 'common/mixins/NavigatableMixin';

import t from 'common/locale';

import {getModel} from 'nti.lib.interfaces';
import {encodeForURI} from 'nti.lib.interfaces/utils/ntiids';

const OutlineNode = getModel('courses.courseoutlinenode');


function isSubmitted (item) {
	return !!((item || {}).Links || []).find(x=> x.rel === 'History');
}


export default React.createClass( {
	displayName: 'CourseOverviewDiscussion',
	mixins: [NavigatableMixin],

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
		item: React.PropTypes.object,
		node: React.PropTypes.instanceOf(OutlineNode)
	},





	render () {
		let {item} = this.props;
		let {label = 'No Label', submissions = 0} = item;

		let submitted = isSubmitted(item);

		let href = path.join('content', encodeForURI(item['Target-NTIID'])) + '/';

		return (
			<a className="overview-survey poll" href={href}>
				<div className="body">
					<div className="icon icon-poll"/>
					<div className="tally-box">
						<div className="message">{label}</div>
						<div className="tally">
							<div className="stat submissions">{t('UNITS.submissions', {count: submissions})}</div>
							{submitted && ( <div className="stat submitted">Submitted!</div> )}
						</div>
					</div>
				</div>
			</a>
		);
	}
});

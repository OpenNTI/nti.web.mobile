import React from 'react';

import Conditional from 'common/components/Conditional';

import {BLANK_IMAGE} from 'common/constants/DataURIs';

import {scoped} from 'common/locale';

const MISSING = '%%missing%%';

const t = scoped('COURSE.CONTACTINFO');

/*
phone: '(405) 325-HELP',
LINK1: {
	label: 'janux@ou.edu',
	link: 'mailto:janux@ou.edu'
},
LINK2: {
	label: 'Service Centers',
	link: 'http://www.ou.edu/content/ouit/help/personal.html'
},
 */

export default React.createClass({
	displayName: 'CourseSupport',

	propTypes: {
		entry: React.PropTypes.object
	},


	shouldRender () {
		let f = {fallback: MISSING};
		return [
			t('phone', f) !== MISSING,
			t('LINK1.label', f) !== MISSING,
			t('LINK2.label', f) !== MISSING
		].some(x => x);
	},


	render () {
		let f = {fallback: MISSING};
		return (
			<Conditional condition={this.shouldRender()} className="course-detail-view">

				<div className="row support">
					<div className="small-12 columns">
						<img src={BLANK_IMAGE} alt="Support"/>
						<div className='meta'>
							<div className="label">Tech Support</div>
							<Conditional condition={t('phone', f) !== MISSING} className="item phone">
								{t('phone')}
							</Conditional>
							<Conditional condition={t('LINK1.label', f) !== MISSING} className="item link">
								<a href={t('LINK1.link')}>{t('LINK1.label')}</a>
							</Conditional>
							<Conditional condition={t('LINK2.label', f) !== MISSING} className="item link">
								<a href={t('LINK2.link')}>{t('LINK2.label')}</a>
							</Conditional>
						</div>
					</div>
				</div>
				<div className="footer"/>

			</Conditional>
		);
	}
});

import React from 'react';

import {BLANK_IMAGE} from 'common/constants/DataURIs';

import {scoped} from 'nti-lib-locale';

const MISSING = '~~missing~~';

const t = scoped('COURSE.CONTACTINFO');

const f = {fallback: MISSING};

export default React.createClass({
	displayName: 'CourseSupport',

	propTypes: {
		entry: React.PropTypes.object
	},


	shouldRender () {
		return [
			t('LINK0.label', f) !== MISSING,
			t('LINK1.label', f) !== MISSING,
			t('LINK2.label', f) !== MISSING
		].some(x => x);
	},


	render () {
		return this.shouldRender() && (
			<div className="course-detail-view">

				<div className="support">
					<img src={BLANK_IMAGE} alt="Support"/>
					<div className="meta">
						<div className="label">{t('label')}</div>
						{[0,1,2].map(x => this.renderLink(x))}
					</div>
				</div>

				<div className="footer"/>

			</div>
		);
	},

	renderLink (index) {
		const label = t(`LINK${index}.label`, f);
		const link = t(`LINK${index}.link`, f);

		if (label === MISSING) {
			return;
		}

		let ref = link === MISSING ? void 0 : link;

		return (
			<div className="item link" key={index}>
				<a href={ref} target="_blank">{label}</a>
			</div>
		);
	}
});

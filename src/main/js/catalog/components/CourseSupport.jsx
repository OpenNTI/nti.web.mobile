import React from 'react';

import Conditional from 'common/components/Conditional';

import {BLANK_IMAGE} from 'common/constants/DataURIs';

import {scoped} from 'common/locale';

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
		return (
			<Conditional condition={this.shouldRender()} className="course-detail-view">

				<div className="row support">
					<div className="small-12 columns">
						<img src={BLANK_IMAGE} alt="Support"/>
						<div className="meta">
							<div className="label">Tech Support</div>
							{[0,1,2].map(x => this.renderLink(x))}
						</div>
					</div>
				</div>
				<div className="footer"/>
			</Conditional>
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
			<div className="item link">
				<a href={ref}>{label}</a>
			</div>
		);
	}
});

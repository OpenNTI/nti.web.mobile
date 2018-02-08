import React from 'react';
import PropTypes from 'prop-types';
import {Constants} from 'nti-web-commons';
import {scoped} from 'nti-lib-locale';

const {DataURIs: {BLANK_IMAGE}} = Constants;

const MISSING = '~~missing~~';

const t = scoped('course.contactInfo', {
	label: 'Tech Support',
	link0: {
		label: 'Support',
		link: 'mailto:support@nextthought.com'
	},
	link1: {
		label: 'Info',
		link: 'mailto:info@nextthought.com'
	},
	link2: {
		label: 'NextThought Website',
		link: 'http://nextthought.com'
	},
	link3: {
		label: 'Help Site',
		link: 'https://help.nextthought.com/'
	}
});

const f = {fallback: MISSING};

export default class extends React.Component {
	static displayName = 'CourseSupport';

	static propTypes = {
		entry: PropTypes.object
	};

	shouldRender = () => {
		return [
			t('link0.label', f) !== MISSING,
			t('link1.label', f) !== MISSING,
			t('link2.label', f) !== MISSING,
			t('link3.label', f) !== MISSING,
		].some(x => x);
	};

	render () {
		return this.shouldRender() && (
			<div className="course-support">
				<img src={BLANK_IMAGE} alt="Support"/>
				<div className="meta">
					<div className="label">{t('label')}</div>
					{[0,1,2,3].map(x => this.renderLink(x))}
				</div>
			</div>
		);
	}

	renderLink = (index) => {
		const label = t(`link${index}.label`, f);
		const link = t(`link${index}.link`, f);

		if (label === MISSING) {
			return;
		}

		let ref = link === MISSING ? void 0 : link;

		return (
			<div className="item link" key={index}>
				<a href={ref} target="_blank" rel="noopener noreferrer">{label}</a>
			</div>
		);
	};
}

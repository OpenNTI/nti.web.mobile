import React from 'react';
import {Link} from 'react-router-component';

import t from 'nti-lib-locale';

SectionTitle.propTypes = {
	section: React.PropTypes.string.isRequired,
	href: React.PropTypes.string
};

export default function SectionTitle (props) {
	const {section, href} = props;
	let Component = href ? Link : 'h1';

	let p = {
		className: 'library-section-title',
		children: t(`LIBRARY.SECTIONS.${section}`),
		href
	};

	return (
		<Component {...p}/>
	);
}

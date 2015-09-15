import React from 'react';
import {Link} from 'react-router-component';

import t from 'common/locale';

export default React.createClass({
	displayName: 'SectionTitle',

	propTypes: {
		section: React.PropTypes.string.isRequired,
		href: React.PropTypes.string
	},

	render () {
		const {props: {section, href}} = this;
		let Component = href ? Link : 'h1';

		let props = {
			className: 'library-section-title',
			children: t(`LIBRARY.SECTIONS.${section}`),
			href
		};

		return (
			<Component {...props}/>
		);
	}
});

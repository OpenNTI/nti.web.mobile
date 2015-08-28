import React from 'react';

import t from 'common/locale';

export default React.createClass({
	displayName: 'SectionTitle',

	propTypes: {
		section: React.PropTypes.string
	},

	render () {
		return (
			<h1 className="library-section-title">{t(`LIBRARY.SECTIONS.${this.props.section}`)}</h1>
		);
	}
});

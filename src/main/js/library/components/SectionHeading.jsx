import React from 'react';

import SectionTitle from './SectionTitle';
import AddButton from './AddButton';

export default React.createClass({
	displayName: 'SectionHeading',

	propTypes: {
		section: React.PropTypes.string.isRequired
	},

	render () {
		const {props: {section}} = this;

		return (
			<div className="library-section-heading">
				<SectionTitle section={section} href={`/${section}/`}/>
				<div className="spacer"/>
				<AddButton section={section}/>
			</div>
		);
	}
});

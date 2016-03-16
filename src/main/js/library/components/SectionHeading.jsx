import React from 'react';

import SectionTitle from './SectionTitle';
import AddButton from './AddButton';

export default function SectionHeading ({section}) {
	return (
		<div className="library-section-heading">
			<SectionTitle section={section} href={`/${section}/`}/>
			<div className="spacer"/>
			<AddButton section={section}/>
		</div>
	);
}

SectionHeading.propTypes = {
	section: React.PropTypes.string.isRequired
};

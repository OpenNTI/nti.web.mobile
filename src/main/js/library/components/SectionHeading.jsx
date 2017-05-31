import PropTypes from 'prop-types';
import React from 'react';

import SectionTitle from './SectionTitle';
import AddButton from './AddButton';

SectionHeading.propTypes = {
	section: PropTypes.string.isRequired
};

export default function SectionHeading ({section}) {
	return (
		<div className="library-section-heading">
			<SectionTitle section={section} href={`/${section}/`}/>
			<div className="spacer"/>
			<AddButton section={section}/>
		</div>
	);
}

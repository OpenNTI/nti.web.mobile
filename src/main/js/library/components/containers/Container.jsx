import React from 'react';
import PropTypes from 'prop-types';

import { EmptyList } from '@nti/web-commons';

import AddButton from '../AddButton';
import Heading from '../SectionHeading';

import Collection from './Collection';

export default function Container({ section, items }) {
	return !items || items.length === 0 ? (
		!AddButton.canSectionBeAddedTo(section) ? (
			<div />
		) : (
			<div className="library-collection-old">
				<Heading section={section} />
				<EmptyList type={`library-${section}`} />
			</div>
		)
	) : (
		<Collection className={section} list={items}>
			<Heading section={section} />
		</Collection>
	);
}

Container.propTypes = {
	section: PropTypes.string,
	items: PropTypes.array,
};

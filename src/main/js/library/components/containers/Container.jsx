import React from 'react';

import EmptyList from 'common/components/EmptyList';

import Collection from './Collection';
import AddButton from '../AddButton';
import Heading from '../SectionHeading';

export default function Container ({section, items}) {
	return !items || items.length === 0 ?
	(!AddButton.canSectionBeAddedTo(section) ? (
		<div/>
	) : (
		<div className="library-collection">
			<Heading section={section}/>
			<EmptyList type={`library-${section}`}/>
		</div>
	)) : (
		<Collection list={items}>
			<Heading section={section}/>
		</Collection>
	);
}

Container.propTypes = {
	section: React.PropTypes.string,
	items: React.PropTypes.array
};

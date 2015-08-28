import React from 'react';

import EmptyList from 'common/components/EmptyList';

import Collection from './Collection';
import AddButton from '../AddButton';
import Heading from '../SectionHeading';

export default React.createClass({
	displayName: 'Container',

	propTypes: {
		section: React.PropTypes.string,
		items: React.PropTypes.array
	},

	render () {
		const {props: {section, items}} = this;

		return !items || items.length === 0 ?
		(!AddButton.canSectionBeAddedTo(section)  ? (
			null
		) : (
			<div>
				<Heading section={section}/>
				<EmptyList type={`library-${section}`}/>
			</div>
		)) : (
			<Collection list={items}>
				<Heading section={section}/>
			</Collection>
		);
	}
});

import './HighlightGroup.scss';
import PropTypes from 'prop-types';
import React from 'react';

import Breadcrumb from 'common/components/BreadcrumbPath';

import ContentIcon from './ContentIcon';
import Highlight from './Highlight';

HighlightGroup.propTypes = {
	items: PropTypes.array.isRequired,
};

export default function HighlightGroup(props) {
	const { items = [] } = props;

	if (items.length === 0) {
		return null;
	}

	return (
		<div className="highlight-group">
			<ContentIcon item={items[0]} />
			<Breadcrumb item={items[0]} />
			{items.map((item, index) => (
				<Highlight item={item} key={'highlight' + index} />
			))}
		</div>
	);
}

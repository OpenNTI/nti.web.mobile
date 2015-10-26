import React from 'react';

import Breadcrumb from 'common/components/BreadcrumbPath';

import ContentIcon from './ContentIcon';
import Highlight from './Highlight';

export default React.createClass({
	displayName: 'HighlightGroup',

	propTypes: {
		ntiid: React.PropTypes.string.isRequired,
		items: React.PropTypes.array.isRequired
	},


	render () {
		let {items = []} = this.props;

		if (items.length === 0) {
			return null;
		}

		return (
			<div className="highlight-group">
				<ContentIcon item={items[0]} />
				<Breadcrumb item={items[0]} />
				{ items.map((item, index) =>(

					<Highlight item={item} key={'highlight' + index} />

				) ) }
			</div>
		);
	}
});

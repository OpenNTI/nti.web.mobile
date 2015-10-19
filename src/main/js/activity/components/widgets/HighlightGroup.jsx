import React from 'react';
import Highlight from './Highlight';
import Breadcrumb from './Breadcrumb';
import ContentIcon from './ContentIcon';

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

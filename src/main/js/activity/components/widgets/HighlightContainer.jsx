import React from 'react';
import DisplayName from 'common/components/DisplayName';
import DateTime from 'common/components/DateTime';

import HighlightGroup from './HighlightGroup';
import Mixin from './Mixin';

export default React.createClass({
	displayName: 'HighlightContainer',

	mixins: [Mixin],

	statics: {
		mimeType: /collated-highlight-container$/i
	},

	propTypes: {
		item: React.PropTypes.object.isRequired
	},

	render () {

		let {item} = this.props;
		let items = item.Items;

		return (
			<div className="highlight-container">
				<div className="heading">
					<DisplayName entity={item.creator} /> created {item.count} highlights on <DateTime date={item.date} />
				</div>

				{ Object.keys(items).map(ntiid => (

					<HighlightGroup key={ntiid} ntiid={ntiid} items={items[ntiid]} />

				) ) }

			</div>
		);
	}
});

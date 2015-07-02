import React from 'react';
import Mixin from './Mixin';
import HighlightGroup from './HighlightGroup';
import DisplayName from 'common/components/DisplayName';
import DateTime from 'common/components/DateTime';

export default React.createClass({
	displayName: 'HighlightContainer',

	mixins: [Mixin],

	statics: {
		mimeType: /collated-highlight-container$/i
	},

	propTypes: {
		item: React.PropTypes.array.isRequired
	},

	render () {

		let {item} = this.props;
		let items = item.Items;

		return (
			<div className="highlight-container">
				<DisplayName username={item.creator} /> created {item.count} highlights on <DateTime date={item.date} />
			{
				Object.keys(items).map(ntiid => <HighlightGroup containerId={ntiid} items={items[ntiid]} />)
			}
			</div>
		);
	}
});

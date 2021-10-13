import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';

import { DateTime } from '@nti/web-commons';
import DisplayName from 'internal/common/components/DisplayName';

import HighlightGroup from './HighlightGroup';
import Mixin from './Mixin';

export default createReactClass({
	displayName: 'HighlightContainer',

	mixins: [Mixin],

	statics: {
		mimeType: /collated-highlight-container$/i,
	},

	propTypes: {
		item: PropTypes.object.isRequired,
	},

	render() {
		let { item } = this.props;
		let items = item.Items;

		return (
			<div className="highlight-container">
				<div className="heading">
					<DisplayName entity={item.creator} /> created {item.count}{' '}
					highlights on <DateTime date={item.date} />
				</div>

				{Object.keys(items).map(ntiid => (
					<HighlightGroup
						key={ntiid}
						ntiid={ntiid}
						items={items[ntiid]}
					/>
				))}
			</div>
		);
	},
});

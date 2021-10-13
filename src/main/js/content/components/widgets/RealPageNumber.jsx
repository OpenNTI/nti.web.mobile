import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';

import { VisibleComponentTracker } from '@nti/web-commons';
import ContextAccessor from 'internal/common/mixins/ContextAccessor';

import Mixin from './Mixin';

export default createReactClass({
	displayName: 'RealPageNumbers',
	mixins: [Mixin, ContextAccessor],

	propTypes: {
		item: PropTypes.shape({
			pageNumber: PropTypes.string.isRequired,
		}),
	},

	statics: {
		itemType: /realpagenumber/i,
	},

	render() {
		const {
			item: { pageNumber },
		} = this.props;
		return (
			<VisibleComponentTracker
				group="real-page-numbers"
				data={{ pageNumber }}
			/>
		);
	},
});

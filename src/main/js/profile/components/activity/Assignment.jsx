import React from 'react';
import Breadcrumb from './Breadcrumb';

import Mixin from './Mixin';

export default React.createClass({
	displayName: 'Assignment',
	mixins: [Mixin],

	statics: {
		mimeType: /assessment\.assignment/i
	},

	propTypes: {
		item: React.PropTypes.any.isRequired
	},

	render () {

		let {item} = this.props;
		if (!item) {
			return null;
		}

		return (
			<div className="assignment">
				<Breadcrumb item={item} />
				<div className="body">
					(Assignment)
				</div>
			</div>
		);
	}
});

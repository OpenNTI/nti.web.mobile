import React from 'react';
import Breadcrumb from './Breadcrumb';

import Mixin from './Mixin';

export default React.createClass({
	displayName: 'CourseOutlineContentNode',
	mixins: [Mixin],

	statics: {
		mimeType: /courseoutlinecontentnode/i
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
			<div className="outline-node">
				<Breadcrumb item={item} />
				<div className="body">
					(Outline Node)
				</div>
			</div>
		);
	}
});

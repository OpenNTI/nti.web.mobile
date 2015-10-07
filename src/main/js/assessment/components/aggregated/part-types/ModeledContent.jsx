import React from 'react';

import CommonParts from './CommonParts';

export default React.createClass({
	displayName: 'AggregatedModeledContent',
	mixins: [CommonParts],

	statics: {
		partType: [
			'ModeledContent'
		]
	},

	render () {
		return (
			<div>
				ModeledContent
			</div>
		);
	}
});

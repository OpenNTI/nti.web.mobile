import React from 'react';

import CommonParts from './CommonParts';

export default React.createClass({
	displayName: 'AggregatedMultipleChoice',
	mixins: [CommonParts],

	statics: {
		partType: [
			'MultipleChoice'
		]
	},


	render () {
		return (
			<div>
				MultipleChoice
			</div>
		);
	}
});

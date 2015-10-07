import React from 'react';

import CommonParts from './CommonParts';

export default React.createClass({
	displayName: 'AggregatedMultipleChoiceMultipleAnswer',
	mixins: [CommonParts],

	statics: {
		partType: [
			'MultipleChoiceMultipleAnswer'
		]
	},

	render () {
		return (
			<div>
				MultipleChoiceMultipleAnswer
			</div>
		);
	}
});

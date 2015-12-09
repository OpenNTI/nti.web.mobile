import React from 'react';

import Store from '../../GradebookStore';

export default React.createClass({
	displayName: 'PageControls',

	render () {

		const {page, count, batchSize} = Store;

		return (
			<div className="gradebook-page-controls">
				<div>page: {page}</div>
				<div>count: {count}</div>
				<div>batchSize: {batchSize}</div>
			</div>
		);
	}
});

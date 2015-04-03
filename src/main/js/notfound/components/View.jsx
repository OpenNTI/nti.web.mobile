import React from 'react';

export default React.createClass({
	displayName: 'NotFound',

	render () {
		/* global pageRenderSetPageNotFound */
		if (global.pageRenderSetPageNotFound) {
			pageRenderSetPageNotFound();
		}
		return (
			<div className="grid-container">
				<hr/>
				<div className="row">
					<div className="small-10 small-centered columns">
						<div className="sadface">:(</div>
						<h2>Error (404)</h2>
						<p>That page was not found.</p>
					</div>
				</div>
			</div>
		);
	}
});

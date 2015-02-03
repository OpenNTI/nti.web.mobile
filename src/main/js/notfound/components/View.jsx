'use strict';

var React = require('react/addons');

module.exports = React.createClass({
	displayName: 'NotFound',
	render: function() {
		/* global __setPageNotFound */
		if (global.__setPageNotFound) {
			__setPageNotFound();
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

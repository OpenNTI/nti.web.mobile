'use strict';

var React = require('react');

module.exports = React.createClass({
	displayName: 'LoadingInline',

	render: function() {
		return (
			<div className="inline-loader-wrap">
				<ul className="loader">
					<li/><li/><li/>
				</ul>
			</div>
		);
	}

});

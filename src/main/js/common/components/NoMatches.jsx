'use strict';
var React = require('react');
var t = require('../locale').scoped('FILTER');

var NoMatches = React.createClass({

	render: function() {
		return (
			<div className="notice nomatches">
				{t('no_matches')}
			</div>
		);
	}

});

module.exports = NoMatches;

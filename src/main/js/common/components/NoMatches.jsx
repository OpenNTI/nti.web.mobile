/** @jsx React.DOM */
'use strict';
var React = require('react/addons');
var t = require('common/locale').scoped('FILTER');

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

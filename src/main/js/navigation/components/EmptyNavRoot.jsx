'use strict';

var React = require('react');
var Notice = require('common/components/Notice');

var EmptyNavRoot = React.createClass({

	render: function() {
		return (
			<Notice>No additional information available</Notice>
		);
	}

});

module.exports = EmptyNavRoot;

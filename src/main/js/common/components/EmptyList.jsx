'use strict';
var React = require('react');
var t = require('../locale').scoped('FILTER');
var Notice = require('./Notice');

var EmptyList = React.createClass({

	render: function() {
		return (
			<Notice>{t('emptyList')}</Notice>
		);
	}

});


module.exports = EmptyList;

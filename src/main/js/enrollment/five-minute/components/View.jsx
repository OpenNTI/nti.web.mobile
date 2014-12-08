/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react/addons');
var FiveMinuteEnrollmentForm = require('./FiveMinuteEnrollmentForm');
var Store = require('../Store');

var View = React.createClass({

	render: function() {
		return (
			<FiveMinuteEnrollmentForm storeContextId={Store.getFormStoreContextId(true)}/>
		);
	}

});

module.exports = View;

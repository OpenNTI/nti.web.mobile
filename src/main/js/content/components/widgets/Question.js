/** @jsx React.DOM */
'use strict';
var React = require('react/addons');

var Assessment = require('assessment');

module.exports = React.createClass({
	displayName: 'NAQuestion',

	statics: {
		mimeType: /naquestion$/i,
		handles: function(item) {
			var type = item.type || '';
			var cls = item.class || '';
			var re = this.mimeType;
			return re.test(type) || re.test(cls);
		}
	},


	componentDidMount: function() {
		console.log(this.props);
	},



	render: function() {
		return (
			<Assessment.QuestionWidget/>
		);
	}
});

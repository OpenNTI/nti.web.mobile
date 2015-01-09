/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react/addons');
var Constants = require('../../Constants');

module.exports = React.createClass({

	displayName: 'PostListItem',
	mixins: [require('./Mixin')],

	statics: {
		inputType: [
			Constants.types.POST
		]
	},

	render: function() {
		var {item} = this.props;

		return (
			<div>
				<div dangerouslySetInnerHTML={{__html: item.body}}/>
				<small>by {item.Creator} at {item.created}</small>
			</div>
		);

	}

});

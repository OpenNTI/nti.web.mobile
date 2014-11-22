/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react/addons');
var Detail = require('library/catalog/components/Detail');
var EnrollButton = require('library/catalog/components/EnrollButton'); // drop course button

var CourseDescription = React.createClass({

	render: function() {

		var detail = this.transferPropsTo(<Detail />);

		return (
			<div>
				{detail}
				<EnrollButton catalogEntry={this.props.entry} dropOnly={true}/>
			</div>
		);
	}

});

module.exports = CourseDescription;


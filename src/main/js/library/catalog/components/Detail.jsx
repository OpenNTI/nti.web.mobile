'use strict';

var React = require('react/addons');

var Title = require('./Title');
var Description = require('./Description');
var Instructors = require('./Instructors');

module.exports = React.createClass({
	displayName: 'Detail',
	propTypes: {
		entry: React.PropTypes.object
	},

	render: function() {
		var entry = this.props.entry;
		return (
			<div className="course-detail-view">
				<Title entry={entry} />
				<Description entry={entry} />
				<Instructors entry={entry}/>
				<div className="footer"/>
			</div>
		);
	}
});

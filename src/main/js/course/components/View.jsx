/** @jsx React.DOM */
'use strict';

var React = require('react/addons');
var Loading = require('../../common/components/Loading');

var Actions = require('../Actions');
var Store = require('../Store');

module.exports = React.createClass({
	propTypes: {
		course: React.PropTypes.string.isRequired
	},

	getInitialState: function() {
		return {};
	},


	componentDidMount: function() {
		Store.addChangeListener(this._onChange);
		this.getDataIfNeeded(this.props);
	},


	componentWillUnmount: function() {
		Store.removeChangeListener(this._onChange);
	},


	componentWillReceiveProps: function(nextProps) {
		if (nextProps.course !== this.props.course) {
			this.getDataIfNeeded(nextProps);
		}
	},


	getDataIfNeeded: function(props) {
		var courseId = decodeURIComponent(props.course);
		this.setState({loading: true});

		Actions.setCourse(courseId);
	},


	_onChange: function() {
		this.setState({loading: false, course: Store.getData()});
	},


	render: function() {
		var course = (this.state.course || {}).CourseInstance;

		if (this.state.loading) {
			return (<Loading/>);
		}

		course = (course && course.getPresentationProperties() || {}).title;

		return (
			<div>
			{course}
			</div>
		);
	}
});

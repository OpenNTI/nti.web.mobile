/** @jsx React.DOM */
'use strict';

var React = require('react/addons');
var Router = require('react-router-component');
var Locations = Router.Locations;
var Location = Router.Location;
var DefaultRoute = Router.NotFound;

var Detail = require('catalog/components/Detail');
var Loading = require('common/components/Loading');
var Error = require('common/components/Error');
var Media = require('./Media');
var Outline = require('./OutlineView');
var Overview = require('./Overview');

var Content = require('content');

var Actions = require('../Actions');
var Store = require('../Store');

module.exports = React.createClass({
	displayName: 'CourseView',

	propTypes: {
		course: React.PropTypes.string.isRequired
	},

	getInitialState: function() {
		return {
			loading: true
		};
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
		var record = this.state.course;
		var course = (record || {}).CourseInstance;
		var entry = course && course.CatalogEntry;

		if (this.state.loading) {
			return (<Loading/>);
		}

		if ((record && record.error) || !course || !entry) {
			return (<Error error={record.error}/>);
		}

		return (
			<Locations contextual>
				<DefaultRoute handler={Detail} entry={entry} noBack/>
				<Location path="/v(/)(:videoId)" handler={Media} course={course} basePath={this.props.basePath}/>
				<Location path="/o(/)" handler={Outline} course={course} basePath={this.props.basePath}/>
				<Location path="/o/:outlineId(/)" handler={Overview} course={course} basePath={this.props.basePath}/>
				<Location path="/o/:outlineId/c/:pageId" handler={Content.View} course={course} basePath={this.props.basePath} pathname="c"/>
			</Locations>
		);
	}
});

/** @jsx React.DOM */
'use strict';

var React = require('react/addons');
var Router = require('react-router-component');
var Locations = Router.Locations;
var Location = Router.Location;
var DefaultRoute = Router.NotFound;

var Detail = require('catalog/components/Detail');
var Loading = require('common/components/Loading');
var Media = require('./Media');
var Outline = require('./OutlineView');
var Overview = require('./Overview');

var Actions = require('../Actions');
var Store = require('../Store');

module.exports = React.createClass({
	displayName: 'CourseView',

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
		var entry = course && course.CatalogEntry;

		if (this.state.loading || !course || !entry) {
			return (<Loading/>);
		}

		return (
			<Locations contextual>
				<DefaultRoute handler={Detail} entry={entry} noBack/>
				<Location path="/v(/)(:videoId)" handler={Media} course={course} basePath={this.props.basePath}/>
				<Location path="/o(/)" handler={Outline} course={course} basePath={this.props.basePath}/>
				<Location path="/o/:outlineId(/)" handler={Overview} course={course} basePath={this.props.basePath}/>
				<Location path="/o/:outlineId/c/:id" handler={React.DOM.div} course={course} basePath={this.props.basePath}/>
			</Locations>
		);
	}
});

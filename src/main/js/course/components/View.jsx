/** @jsx React.DOM */
'use strict';
var NTIID = require('dataserverinterface/utils/ntiids');
var React = require('react/addons');
var Router = require('react-router-component');

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
		var courseId = NTIID.decodeFromURI(props.course);
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
			<Router.Locations contextual>
				<Router.Location path="/v/(:videoId/)(#:nav)" handler={Media} course={course} basePath={this.props.basePath}/>
				<Router.Location path="/o/(#:nav)" handler={Outline} course={course} basePath={this.props.basePath}/>
				<Router.Location path="/o/:outlineId/(#:nav)" handler={Overview} course={course} basePath={this.props.basePath}/>
				<Router.Location path="/o/:outlineId/c/:pageId/(#:nav)" handler={Content.View} course={course} basePath={this.props.basePath} pathname="c"/>
				<Router.NotFound handler={Detail} entry={entry} noBack/>
			</Router.Locations>
		);
	}
});

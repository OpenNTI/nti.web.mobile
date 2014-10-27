/** @jsx React.DOM */
'use strict';
var NTIID = require('dataserverinterface/utils/ntiids');
var React = require('react/addons');
var Router = require('react-router-component');

var Detail = require('catalog/components/Detail');
var Loading = require('common/components/Loading');
var ErrorWidget = require('common/components/Error');
var Media = require('./Media');
var Outline = require('./OutlineView');
var Overview = require('./Overview');

var Content = require('content');

var Actions = require('../Actions');
var Store = require('../Store');
var Promise = global.Promise || require('es6-promise').Promise;

var path = require('path');

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
			return (<ErrorWidget error={record.error}/>);
		}

		return (
			<Router.Locations contextual>
				<Router.Location path="/v/(:videoId/)(#:nav)"
									handler={Media}
									course={course}
									basePath={this.props.basePath}
									contextProvider={this.__getContext}/>

				<Router.Location path="/o/(#:nav)"
									handler={Outline}
									course={course}
									basePath={this.props.basePath}/>

				<Router.Location path="/o/:outlineId/(#:nav)"
									handler={Overview}
									course={course}
									basePath={this.props.basePath}
									contextProvider={this.__getContext}/>
									

				<Router.Location path="/o/:outlineId/c/:rootId/*"
									handler={Content.Viewer}
									course={course}
									basePath={this.props.basePath}
									slug="c"
									contextProvider={this.__getContext}/>

				<Router.NotFound handler={Detail} entry={entry} noBack/>
			</Router.Locations>
		);
	},


	/**
	 * Resolves the current context given the props from the direct decendent
	 * that asks.
	 *
	 * @param {Object} props The props set from the handler of the route.
	 */
	__getContext: function(props) {
		var record = this.state.course;
		var course = (record || {}).CourseInstance;
		var presentation = course.getPresentationProperties();

		if (props.videoId && !props.outlineId) {
			return Promise.resolve([
				course.getID(),
				props.videoId
			]);
		}

		return course.getOutlineNode(NTIID.decodeFromURI(props.outlineId))
			.then(function(o) {
				return [
					{
						label: presentation.label,
						href: path.join(this.props.basePath, 'course', this.props.course, '/')
					},
					{
						label: o.title,
						href: path.join(this.props.basePath, o.href)
					}
				];

			}.bind(this));
	}
});

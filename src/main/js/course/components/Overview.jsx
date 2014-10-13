/** @jsx React.DOM */
'use strict';
var NTIID = require('dataserverinterface/utils/ntiids');
var React = require('react/addons');

var DateTime = require('common/components/DateTime');
var Loading = require('common/components/Loading');
var ErrorWidget = require('common/components/Error');

var Widgets = require('./widgets');
var Actions = require('../Actions');
var Store = require('../Store');

module.exports = React.createClass({
	displayName: 'CourseOverview',

	propTypes: {
		course: React.PropTypes.object.isRequired,
		outlineId: React.PropTypes.string.isRequired
	},

	getInitialState: function() {
		return {
			loading: true,
			error: false,
			data: null
		};
	},


	componentDidMount: function() {
		//Store.addChangeListener(this._onChange);
		this.getDataIfNeeded(this.props);
	},


	componentWillUnmount: function() {
		//Store.removeChangeListener(this._onChange);
	},


	componentWillReceiveProps: function(nextProps) {
		if (nextProps.outlineId !== this.props.outlineId) {
			this.getDataIfNeeded(nextProps);
		}
	},


	__getOutlineNodeContents: function(node) {
		try {
			node.getContent()
				.then(function(overviewData) {
					this.setState({
						node: node,
						data: overviewData,
						loading: false,
						error: false
					});
				}.bind(this))
				.catch(this.__onError);
		} catch (e) {
			this.__onError(e);
		}
	},


	__onError: function(error) {
		this.setState({
			loading: false,
			error: error,
			data: null
		});
	},


	getDataIfNeeded: function(props) {
		this.setState(this.getInitialState());
		try {

			props.course.getOutlineNode(NTIID.decodeFromURI(props.outlineId))
				.then(this.__getOutlineNodeContents)
				.catch(this.__onError);

		} catch (e) {
			this.__onError(e);
		}
	},


	render: function() {
		var data = this.state.data;
		var node = this.state.node;

		if (this.state.loading) { return (<Loading/>); }
		if (this.state.error) {	return (<ErrorWidget error={this.state.error}/>); }

		return (
			<div className="course-overview row">
				<DateTime date={node.AvailableBeginning} className="label" format="dddd, MMMM Do"/>
				<h1 dangerouslySetInnerHTML={{__html: data.title}}/>
				{this._renderItems(data.Items, '')}
			</div>
		);
	},


	_renderItems: function(items, overviewType) {
		var toReturn = items && items.map(function(item, i, list) {
			return this.transferPropsTo(Widgets.select(item, i, list, this._renderItems(item.Items, item.title), overviewType));
		}.bind(this));
		return toReturn;
	}
});

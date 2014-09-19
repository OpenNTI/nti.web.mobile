/** @jsx React.DOM */
'use strict';

var React = require('react/addons');

var isEmpty = require('dataserverinterface/utils/isempty');
var waitFor = require('dataserverinterface/utils/waitfor');

var Loading = require('common/components/Loading');

var Navigation = require('navigation');
var Actions = require('../Actions');
var Store = require('../Store');

module.exports = React.createClass({
	displayName: 'OutlineView',

	propTypes: {
		course: React.PropTypes.object.isRequired
	},


	getInitialState: function() {
		return {loading:true};
	},


	componentDidMount: function() {
		this.getDataIfNeeded(this.props);
		Navigation.Actions.openDrawer();
	},


	componentWillReceiveProps: function(nextProps) {
		if (nextProps.course !== this.props.course) {
			this.getDataIfNeeded(nextProps);
		}
	},


	getDataIfNeeded: function(props) {
		this.setState({loading: true});
		var course = props.course;
		var outline = [];
		var work = !course ? Promise.reject() :
			course.getOutline()
				.then(function(data) { outline = data; });

		var map = this._DEPTH_MAP = [
			React.DOM.h3,
			React.DOM.div
		];

		var prefix = props.basePath;

		waitFor(work)
			.then(function() {
				if (outline.getMaxDepth() > 2) {
					map.unshift(React.DOM.h1);
				}

				this.setState({
					loading: false,
					outline: outline,
					prefix: prefix
				});
			}.bind(this));
	},


	render: function() {
		var outline = this.state.outline;

		if (this.state.loading) {
			return (<Loading/>);
		}

		return (
			<div>
				{this._renderTree(outline.contents)}
			</div>
		);
	},


	_renderTree: function(list) {
		var _renderTree = this._renderTree;
		var depthMap = this._DEPTH_MAP;
		var prefix = this.state.prefix || '';

		if (isEmpty(list)) {
			return null;
		}

		return (
			<ul>
				{list.map(function(item) {
					var children = _renderTree(item.contents);
					var href = item.href;
					var Tag = depthMap[item.getDepth() - 1] || React.DOM.div;

					if (href) {
						href = prefix + href;
					}

					return (
						<li>
							<Tag><a href={href}>{item.title}</a></Tag>
							{children}
						</li>
					);
				})}
			</ul>
		);

	}
});

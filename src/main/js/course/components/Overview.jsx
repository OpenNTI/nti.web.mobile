/** @jsx React.DOM */
'use strict';

var React = require('react/addons');

var Loading = require('../../common/components/Loading');
var Error = require('../../common/components/Error');

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
			props.course.getOutlineNode(decodeURIComponent(props.outlineId))
				.then(this.__getOutlineNodeContents)
				.catch(this.__onError);

		} catch (e) {
			this.__onError(e);
		}
	},


	render: function() {

		if (this.state.loading) {
			return (<Loading/>);
		}

		if (this.state.error) {
			return <Error error={this.state.error}/>
		}

		return (
			<div>{this.state.data}</div>
		);
	}
});

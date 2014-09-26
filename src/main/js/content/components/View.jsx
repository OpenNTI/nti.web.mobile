/** @jsx React.DOM */
'use strict';

var React = require('react/addons');

var Loading = require('common/components/Loading');

var Widgets = require('./widgets');

var Store = require('../Store');
var Actions = require('../Actions');

module.exports = React.createClass({
	displayName: 'View',

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


	componentWillReceiveProps: function(props) {
		if (this.props.pageId !== props.pageId) {
			this.getDataIfNeeded(nextProps);
		}
	},


	getDataIfNeeded: function(props) {
		this.setState(this.getInitialState());
		Actions.loadPage(decodeURIComponent(props.pageId));
	},


	_onChange: function() {
		var id = decodeURIComponent(this.props.pageId);
		var data = Store.getPageData(id);

		this.setState({
			data: data,
			content: data.content,
			styles: data.styles
		});
	},


	render: function() {
		var content = this.state.content;
		return (
			<div className="content-view">
				{this._applyStyle()}
				<div id="NTIContent" dangerouslySetInnerHTML={{__html: content}}/>
			</div>
		);
	},


	_applyStyle: function() {
		return (this.state.styles || []).map(function(css) {
			return (<style scoped type="text/css" dangerouslySetInnerHTML={{__html: css}}/>);
		});
	}
});

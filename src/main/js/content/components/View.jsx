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
			loading: true,
			pageWidgets: {}
		};
	},


	componentDidMount: function() {
		//The getDOMNode() will always be the loading dom at his point...
		//we wait for the re-render of the actual data in componentDidUpdate()
		Store.addChangeListener(this._onChange);
		this.getDataIfNeeded(this.props);
	},


	componentWillUnmount: function() {
		console.debug('Content View: Unmounting...');
		Store.removeChangeListener(this._onChange);
		//Cleanup our components...
		var guid, el,
			widgets = this.getPageWidgets();

		for(guid in widgets) {
			el = document.getElementById(guid);
			React.unmountComponentAtNode(el);
			el.removeAttribute('mounted');
		}
	},


	componentDidUpdate: function () {
		//See if we need to re-mount/render our components...
		var guid, el, w,
			widgets = this.getPageWidgets();
		console.debug('Content View: Did Update... %o', widgets);

		for(guid in widgets) {
			el = document.getElementById(guid);
			w = widgets[guid];
			if (el && !el.hasAttribute('mounted')) {
				console.debug('Content View: Mounting Widget...');
				try {
					w = React.renderComponent(w, el);
					el.setAttribute('mounted', 'true');
				} catch (e) {
					console.error('A content widget blew up while rendering: %s', e.stack || e.message || e);
				}
			}
		}
	},

	componentWillUpdate: function () {
		//Do bookkeeping for "out-of-flow" components...
	},

	componentWillReceiveProps: function(props) {
		if (this.props.pageId !== props.pageId) {
			this.getDataIfNeeded(nextProps);
		}
	},


	getDataIfNeeded: function(props) {
		this.setState(this.getInitialState());
		Actions.loadPage(this.getPageID());
	},


	getPageID: function () {
		return decodeURIComponent(this.props.pageId);
	},


	getPageWidgets: function() {
		var o = this.state.pageWidgets;
		var id = this.getPageID();
		if (!o[id]) {
			console.debug('Content View: Creating bin for PageWidgets for %s', id);
			o[id] = {};
		}
		return o[id];
	},


	maybeCreateWidget: function(widgetData) {
		var widgets = this.getPageWidgets();
		if (!widgets[widgetData.guid]) {
			console.debug('Content View: Creating widget for %s', widgetData.guid);
			widgets[widgetData.guid] = this.transferPropsTo(Widgets.select(widgetData));
		}
	},


	_onChange: function() {
		var id = this.getPageID();
		var data = Store.getPageData(this.getPageID());

		this.setState({
			data: data,
			body: data.body,
			styles: data.styles
		});
	},


	render: function() {
		var body = this.state.body || [];
		return (
			<div className="content-view">
				{this._applyStyle()}
				<div id="NTIContent" dangerouslySetInnerHTML={{
					__html: body.map(this._buildBody).join('')
				}}/>
			</div>
		);
	},


	_buildBody: function(part) {

		if (typeof part === 'string') {
			return part;
		}

		this.maybeCreateWidget(part);

		return '<div id="'+ part.guid +'">If this is still visible, something went wrong.</div>';
	},


	_applyStyle: function() {
		return (this.state.styles || []).map(function(css) {
			return (<style scoped type="text/css" dangerouslySetInnerHTML={{__html: css}}/>);
		});
	}
});

/** @jsx React.DOM */
'use strict';

var Promise = global.Promise || require('es6-promise').Promise;

var NTIID = require('dataserverinterface/utils/ntiids');
var guid = require('dataserverinterface/utils/guid');

var React = require('react/addons');
var RouterMixin = require('react-router-component').RouterMixin;

var Loading = require('common/components/Loading');
//var ErrorWidget = require('common/components/Error');

var Pager = require('common/components/Pager');

var Widgets = require('./widgets');
var Breadcrumb = require('./Breadcrumb');


var Store = require('../Store');
var Actions = require('../Actions');


module.exports = React.createClass({
	mixins: [
		require('./viewer-parts/mock-router'),
		require('./viewer-parts/analytics'),
		require('./viewer-parts/glossary'),
		require('./viewer-parts/interaction'),
		RouterMixin
	],
	displayName: 'Viewer',


	getResetState: function () {
		return {
			loading: true,
			pageWidgets: {},
			contextPromise: Promise.resolve([])
		};
	},


	getInitialState: function() {
		return this.getResetState();
	},


	componentDidMount: function() {
		//The getDOMNode() will always be the loading dom at his point...
		//we wait for the re-render of the actual data in componentDidUpdate()
		Store.addChangeListener(this.onChange);
		this.getDataIfNeeded(this.props);
	},


	componentWillUnmount: function() {
		this._resourceUnloaded();
		Store.removeChangeListener(this.onChange);
		//Cleanup our components...
		var guid, el,
			widgets = this.getPageWidgets();

		for(guid in widgets) {
			if (!widgets.hasOwnProperty(guid)) {continue;}
			el = document.getElementById(guid);
			if (el) {
				React.unmountComponentAtNode(el);
				el.removeAttribute('mounted');
			}
		}
	},


	componentDidUpdate: function () {
		//See if we need to re-mount/render our components...
		var guid, el, w,
			widgets = this.getPageWidgets();
		// console.debug('Content View: Did Update... %o', widgets);

		if (widgets) {
			for(guid in widgets) {
				if (!widgets.hasOwnProperty(guid)) {continue;}
				el = document.getElementById(guid);
				w = widgets[guid];
				if (el && !el.hasAttribute('mounted')) {
					// console.debug('Content View: Mounting Widget...');
					try {
						w = React.renderComponent(w, el);
						el.setAttribute('mounted', 'true');
					} catch (e) {
						console.error('A content widget blew up while rendering: %s', e.stack || e.message || e);
					}
				}
			}
		}
	},


	componentWillReceiveProps: function(props) {
		this.getDataIfNeeded(props);
	},


	getDataIfNeeded: function(props) {
		var newPage = this.getPageID(props) !== this.state.currentPage;
		var newRoot = this.getRootID(props) !== this.getRootID();

		if (newPage || newRoot) {
			var incomingPageId = this.getPageID(props);
			this.setState(this.getResetState());

			Actions.loadPage(incomingPageId);
			this._resourceLoaded(incomingPageId);
		}
	},


	getRootID: function(props) {
		return NTIID.decodeFromURI((props ||this.props).rootId);
	},


	getPageID: function (props) {
		var p = props || this.props;
		var h = this.getPropsFromRoute(p);
		return NTIID.decodeFromURI(h.pageId || p.rootId);
	},


	getPageWidgets: function() {
		var o = this.state.pageWidgets;
		var id = this.getPageID();
		if (o && !o[id]) {
			//console.debug('Content View: Creating bin for PageWidgets for %s', id);
			o[id] = {};
		}
		return o && o[id];
	},


	maybeCreateWidget: function(widgetData) {
		var widgets = this.getPageWidgets();
		if (!widgets[widgetData.guid]) {
			// console.debug('Content View: Creating widget for %s', widgetData.guid);
			widgets[widgetData.guid] = this.transferPropsTo(Widgets.select(widgetData, this.state.data));
		}
	},


	onChange: function() {
		var id = this.getPageID();
		var data = Store.getPageData(this.getPageID());

		this.setState({
			currentPage: id,
			loading: false,
			data: data,
			pageSource: data.tableOfContents.getPageSource(this.getRootID()),
			body: data.body,
			styles: data.styles,
			contextPromise: this.props.contextProvider(this.props)
		});
	},


	render: function() {
		var body = this.state.body || [];
		var pageSource = this.state.pageSource;

		if (this.state.loading) {
			return (<Loading/>);
		}

		return (
			<div className="content-view">
				<Breadcrumb contextProvider={this.__getContext}>
					<Pager pageSource={pageSource} current={this.getPageID()}/>
				</Breadcrumb>

				{this.__applyStyle()}

				<div id="NTIContent" onClick={this.onContentClick}
					dangerouslySetInnerHTML={{__html: body.map(this.__buildBody).join('')}}/>

				{this.renderGlossaryEntry()}

				<Pager position="bottom" pageSource={pageSource} current={this.getPageID()}/>
			</div>
		);
	},


	__buildBody: function(part) {

		if (typeof part === 'string') {
			return part;
		}

		this.maybeCreateWidget(part);

		return '<div id="'+ part.guid +'">If this is still visible, something went wrong.</div>';
	},


	__applyStyle: function() {
		return (this.state.styles || []).map(function(css) {
			return (<style scoped type="text/css" key={guid()} dangerouslySetInnerHTML={{__html: css}}/>);
		});
	},


	__getContext: function() {
		// var data = this.state.data;
		var getContext = this.state.contextPromise || Promise.resolve([]);
		return getContext.then(function(context) {
			//TODO: have the Content Api resolve page title...
			// context.push({
			// 	label: '??Current Page??',
			// 	href: null
			// });
			return context;
		});
	}
});

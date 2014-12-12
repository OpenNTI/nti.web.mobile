/** @jsx React.DOM */
'use strict';



var noContextProvider = Promise.resolve.bind(Promise, []);

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
		require('./viewer-parts/assessment'),
		RouterMixin
	],
	displayName: 'Viewer',


	getResetState: function () {
		return {
			loading: true,
			pageWidgets: {}
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
		var newPageId = this.getPageID(props);
		var newPage = newPageId !== this.state.currentPage;
		var newRoot = this.getRootID(props) !== this.getRootID();
		var initial = this.props === props;

		if (initial || newPage || newRoot) {
			this.setState(Object.assign({
					currentPage: newPageId
				},
				this.getResetState()
				)
			);

			Actions.loadPage(newPageId);
			this._resourceLoaded(newPageId);
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
			widgets[widgetData.guid] = Widgets.select(widgetData, this.state.page, this.props);
		}
	},


	onChange: function() {
		var id = this.getPageID();
		var page = Store.getPageDescriptor(this.getPageID());

		this.setState({
			currentPage: id,
			loading: false,
			page: page,
			pageSource: page.getPageSource(this.getRootID())
		});
	},


	getBodyParts: function () {
		var page = this.state.page;
		if (page) {
			return page.getBodyParts();
		}
	},


	getPageStyles: function () {
		var page = this.state.page;
		if (page) {
			return page.getPageStyles();
		}
	},


	render: function() {
		var body = this.getBodyParts() || [];
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

				{this.renderAssessmentHeader()}

				<div id="NTIContent" onClick={this.onContentClick}
					dangerouslySetInnerHTML={{__html: body.map(this.__buildBody).join('')}}/>

				{this.renderAssessmentFeedback()}

				{this.renderGlossaryEntry()}

				<Pager position="bottom" pageSource={pageSource} current={this.getPageID()}/>

				{this.renderAssessmentSubmission()}
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
		var styles = this.getPageStyles() || [];
		return styles.map(function(css) {
			return (<style scoped type="text/css" key={guid()} dangerouslySetInnerHTML={{__html: css}}/>);
		});
	},


	__getContext: function() {
		var getContextFromProvider = this.props.contextProvider || noContextProvider;

		return getContextFromProvider(this.props).then(function(context) {
			//TODO: have the Content Api resolve page title...
			// context.push({
			// 	label: '??Current Page??',
			// 	href: null
			// });
			return context;
		});
	}
});

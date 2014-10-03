/** @jsx React.DOM */
'use strict';

var NTIID = require('dataserverinterface/utils/ntiids');

var React = require('react/addons');

var Loading = require('common/components/Loading');

var getTarget = require('common/Utils').Dom.getEventTarget;

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
			this.getDataIfNeeded(props);
		}
	},


	getDataIfNeeded: function(props) {
		this.setState(this.getInitialState());
		Actions.loadPage(this.getPageID());
	},


	getPageID: function () {
		return NTIID.decodeFromURI(this.props.pageId);
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
			<div className="content-view" onClick={this._onContentClick}>
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
	},


	_onContentClick: function (e) {
		var anchor = getTarget(e, 'a[href]');
		var href, scrollToEl, fn, id, frag;
		if (anchor) {
			//anchor.getAttribute('href') is different than anchor.href...
			//The property on the anchor is the FULLY RESOLVED `href`, where the
			//attribute value is the raw source...thats the one we want to compare.
			href = anchor.getAttribute('href') || '';

			if (href.charAt(0) !== '#') {
				//This seems to work...if this doesn't open the link into a new
				//tab/window for IE/Firefox/Safari we can add this attribute after
				//the component updates.
				anchor.setAttribute('target', '_blank');
			} else {
				e.preventDefault();
				id = href.substr(1);
				scrollToEl = document.getElementById(id) || document.getElementsByName(id)[0];
				if (!scrollToEl) {
					console.warn('Link (%s) refers to an element not found by normal means on the page.', href);
				} else {
					fn = scrollToEl.scrollIntoViewIfNeeded || scrollToEl.scrollIntoView;
					if (fn) {
						fn.call(scrollToEl, true);
					} else {
						console.warn('No function to scroll... pollyfill time');
					}
				}
				return;
			}

			href = href.split('#');
			id = href[0];
			frag = href[1];

			if (NTIID.isNTIID(id)) {
				e.preventDefault();
				debugger;
			}
		}
	}
});

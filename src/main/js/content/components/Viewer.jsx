/** @jsx React.DOM */
'use strict';

var Promise = global.Promise || require('es6-promise').Promise;

var NTIID = require('dataserverinterface/utils/ntiids');

var React = require('react/addons');
var RouterMixin = require('react-router-component').RouterMixin;

var Loading = require('common/components/Loading');
var ErrorWidget = require('common/components/Error');

var Pager = require('common/components/Pager');

var getTarget = require('common/Utils').Dom.getEventTarget;

var Widgets = require('./widgets');
var Breadcrumb = require('./Breadcrumb');
var GlossaryEntry = require('./GlossaryEntry');

var Store = require('../Store');
var Actions = require('../Actions');
var Analytics = require('common/analytics');

var merge = require('react/lib/merge');
var keyMirror = require('react/lib/keyMirror');
var Utils = require('common/Utils');

// keep track of the view start event so we can push analytics including duration
var _priorEvent = null;

var VIEW_EVENT = keyMirror({
	UNMOUNT: null,
	UPDATE: null
});

function diff(obj1,obj2) {
	var keySet = Utils.arrayUnion(Object.keys(obj1),Object.keys(obj2));
	var diffs = keySet.filter(function(k) {
		return obj1[k] !== obj2[k];
	});
	return diffs;
}

module.exports = React.createClass({
	mixins: [RouterMixin],
	displayName: 'Viewer',


	getDefaultProps: function() {
		return {
			contextual: true//Leave this here... used by the RouterMixin
		};
	},


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

	componentWillMount: function() {
		this._setRouteProps();
	},

	_setRouteProps: function() {
		// because we're mimicking a router, props captured from the route's path are not present in this.props.
		// (e.g. no this.props.glossaryid from path '/glossary/:glossaryid')
		// copy them in. (is it a bad idea to alter this.props directly like this?)
		var m = this.getMatch();
		this.props = merge(this.props,m.match||{});
	},

	componentDidMount: function() {
		//The getDOMNode() will always be the loading dom at his point...
		//we wait for the re-render of the actual data in componentDidUpdate()
		Store.addChangeListener(this._onChange);
		this.getDataIfNeeded(this.props);
	},


	componentWillUnmount: function() {
		this._viewerEvent(VIEW_EVENT.UNMOUNT);
		console.debug('Content View: Unmounting...');
		Store.removeChangeListener(this._onChange);
		//Cleanup our components...
		var guid, el,
			widgets = this.getPageWidgets();

		for(guid in widgets) {
			el = document.getElementById(guid);
			if (el) {
				React.unmountComponentAtNode(el);
				el.removeAttribute('mounted');
			}
		}
	},

	_getEventData: function() {
		return {
			timestamp: Date.now(),
			pageId: this.props.pageId,
			outlineId: this.props.outlineId,
			rootId: this.props.rootId
		}
	},


	_viewerEvent: function(eventType) {
		var evt = this._getEventData();
		if( !_priorEvent ) {
			_priorEvent = evt;
			return;
		}

		var diffs = diff(_priorEvent,evt);
		var weCare = eventType === VIEW_EVENT.UNMOUNT || ['pageId','outlineId','rootId'].some(function(v) {
			return diffs.indexOf(v) !== -1;
		});

		if(evt.pageId && !_priorEvent.pageId) {
			// just loaded?
		}

		if(!weCare) {
			console.debug('don\'t care');
			return;
		}

		console.debug('we care. %s %O %O', eventType, evt, _priorEvent);
	
		var time_length = (evt.timestamp - _priorEvent.timestamp)/1000;
		var resource_id = _priorEvent.pageId||_priorEvent.rootId;

		this.__getContext().then(function(context) {
			Analytics.Actions.emitEvent(
				Analytics.Constants.VIEWER_EVENT,
				{
					type:'resource-viewed',
					resource_id: resource_id,
					course: this.props.course.getID(),
					context_path: context,
					time_length: time_length,
					MimeType: "application/vnd.nextthought.analytics.resourceevent",
					timestamp: Date.now()
				}
			);	
		}.bind(this));

		_priorEvent = evt;

		/* reference event from yoinked from a webapp request
		    {
		      "type": "resource-viewed",
		      "resource_id": "tag:nextthought.com,2011-10:OU-HTML-CHEM1315_F_2014_GeneralChemistry.02.01_OBJECTIVE",
		      "course": "tag:nextthought.com,2011-10:system-OID-0x010c4383:5573657273:ZYY7VU9DzBb",
		      "context_path": [
		        "tag:nextthought.com,2011-10:system-OID-0x010c4383:5573657273:ZYY7VU9DzBb",
		        "overview",
		        "tag:nextthought.com,2011-10:OU-HTML-CHEM1315_F_2014_GeneralChemistry.lec:about_janux",
		        "tag:nextthought.com,2011-10:OU-HTML-CHEM1315_F_2014_GeneralChemistry.lec:unit2"
		      ],
		      "time_length": 6.976,
		      "MimeType": "application/vnd.nextthought.analytics.resourceevent",
		      "user": "ray.hatfield",
		      "timestamp": 1414276487.701
		    }
		*/
		
	},

	componentDidUpdate: function () {
		//See if we need to re-mount/render our components...
		var guid, el, w,
			widgets = this.getPageWidgets();
		// console.debug('Content View: Did Update... %o', widgets);

		this._setRouteProps();
		this._viewerEvent(VIEW_EVENT.UPDATE);

		if (widgets) for(guid in widgets) {
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
	},


	componentWillUpdate: function () {
		//Do bookkeeping for "out-of-flow" components...
	},


	componentWillReceiveProps: function(props) {
		this.getDataIfNeeded(props);
	},


	getDataIfNeeded: function(props) {
		var newPage = this.getPageID(props) !== this.state.currentPage;
		var newRoot = this.getRootID(props) !== this.getRootID();

		if (newPage || newRoot) {
			this.setState(this.getResetState());
			Actions.loadPage(this.getPageID());
		}
	},


	/**
	 * For the RouterMixin
	 * @private
	 * @param {Object} props
	 */
	getRoutes: function(props) {
		return [{
			handler: function(p) {return p;},
			path: '/:pageId/'
		},
		{
			handler: function(p) {return p;},
			path: '/:pageId/glossary/:glossaryid'
		}];
	},


	getRootID: function(props) {
		return NTIID.decodeFromURI((props ||this.props).rootId);
	},


	getPageID: function (props) {
		var p = props || this.props;
		var h = p;
		var m = this.getMatch();

		if (m) {
			h = m.getHandler() || p;
		}

		return NTIID.decodeFromURI(h.pageId || p.rootId);
	},


	getPageWidgets: function() {
		var o = this.state.pageWidgets;
		var id = this.getPageID();
		if (o && !o[id]) {
			console.debug('Content View: Creating bin for PageWidgets for %s', id);
			o[id] = {};
		}
		return o && o[id];
	},


	maybeCreateWidget: function(widgetData) {
		var widgets = this.getPageWidgets();
		if (!widgets[widgetData.guid]) {
			// console.debug('Content View: Creating widget for %s', widgetData.guid);
			widgets[widgetData.guid] = this.transferPropsTo(Widgets.select(widgetData));
		}
	},


	_onChange: function() {
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


	_dismissGlossary: function() {
		var m = this.getMatch();
		var pid = m.match.pageId;
		this.navigate('/'+pid+'/');
	},

	render: function() {
		var body = this.state.body || [];
		var pageSource = this.state.pageSource;

		if (this.state.loading) {
			return (<Loading/>);
		}

		var glossaryEntry = this.props.glossaryid ? <GlossaryEntry entryid={this.props.glossaryid} onClick={this._dismissGlossary} /> : null;

		return (
			<div className="content-view">
				<Breadcrumb contextProvider={this.__getContext}>
					<Pager pageSource={pageSource} current={this.getPageID()}/>
				</Breadcrumb>
				{this._applyStyle()}
				<div id="NTIContent" onClick={this._onContentClick} dangerouslySetInnerHTML={{
					__html: body.map(this._buildBody).join('')
				}}/>
				{glossaryEntry}
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

	_reroute: function(anchor) {
		var isGlossaryLink = anchor.classList.contains('ntiglossaryentry');
		if (isGlossaryLink) {
			var href = anchor.getAttribute('href');
			anchor.setAttribute('href', location.href + 'glossary/' + href.substr(1));
			return true;
		}
		return false;
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
			}
			else {
				if( this._reroute(anchor)) {
					return;
				}
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
			}
		}
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

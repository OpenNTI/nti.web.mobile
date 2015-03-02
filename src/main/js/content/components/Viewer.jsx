const noContextProvider = Promise.resolve.bind(Promise, []);

import {decodeFromURI} from 'dataserverinterface/utils/ntiids';
import guid from 'dataserverinterface/utils/guid';

import React from 'react';
import {RouterMixin} from 'react-router-component';

import Loading from 'common/components/Loading';
//import ErrorWidget from 'common/components/Error';

import StoreEvents from 'common/mixins/StoreEvents';
import HasPageSource from 'common/mixins/HasPageSource';

import Pager from 'common/components/Pager';


import {getWidget} from './widgets';


import Store from '../Store';
import {loadPage} from '../Actions';

import {RESOURCE_VIEWED} from 'dataserverinterface/models/analytics/MimeTypes';

import AnalyticsBehavior from 'analytics/mixins/ResourceLoaded';
import RouterLikeBehavior from './viewer-parts/mock-router';
import GlossaryFeature from './viewer-parts/glossary';
import Interactions from './viewer-parts/interaction';
import AssessmentFeature from './viewer-parts/assessment';


export default React.createClass({
	mixins: [
		StoreEvents,
		RouterLikeBehavior,
		AnalyticsBehavior,
		GlossaryFeature,
		Interactions,
		AssessmentFeature,
		RouterMixin,
		HasPageSource
	],
	displayName: 'Viewer',


	backingStore: Store,
	backingStoreEventHandlers: {
		default: 'onStoreChange'
	},

	getResetState () {
		return {
			loading: true,
			pageWidgets: {},
			page: null,
			pageSource: null
		};
	},


	getInitialState () {
		return this.getResetState();
	},


	componentDidMount () {
		//The getDOMNode() will always be the loading dom at his point...
		//we wait for the re-render of the actual data in componentDidUpdate()
		this.getDataIfNeeded(this.props);
	},


	componentWillUnmount () {
		this._resourceUnloaded();
		this.cleanupWidgets();
	},


	componentDidUpdate () {
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
						w = React.render(w, el);
						el.setAttribute('mounted', 'true');
					} catch (e) {
						console.error('A content widget blew up while rendering: %s', e.stack || e.message || e);
					}
				}
			}
		}
	},


	componentWillReceiveProps (props) {
		this.getDataIfNeeded(props);
	},


	cleanupWidgets () {
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


	getDataIfNeeded (props) {
		var newPageId = this.getPageID(props);
		var newPage = newPageId !== this.state.currentPage;
		var newRoot = this.getRootID(props) !== this.getRootID();
		var initial = this.props === props;

		if (initial || newPage || newRoot) {
			this.cleanupWidgets();
			this.setState(
				Object.assign(
					{ currentPage: newPageId },
					this.getResetState()
				)
			);

			loadPage(newPageId);
			this._resourceLoaded(newPageId, null, RESOURCE_VIEWED);
		}
	},


	getRootID (props) {
		return decodeFromURI((props ||this.props).rootId);
	},


	getPageID (props) {
		var p = props || this.props;
		var h = this.getPropsFromRoute(p);
		return decodeFromURI(h.pageId || p.rootId);
	},


	getPageWidgets () {
		var o = this.state.pageWidgets;
		var id = this.getPageID();
		if (o && !o[id]) {
			//console.debug('Content View: Creating bin for PageWidgets for %s', id);
			o[id] = {};
		}
		return o && o[id];
	},


	createWidget (widgetData) {
		var widgets = this.getPageWidgets();
		if (!widgets[widgetData.guid]) {
			// console.debug('Content View: Creating widget for %s', widgetData.guid);
			widgets[widgetData.guid] = getWidget(
				widgetData,
				this.state.page,
				Object.assign({}, this.props, {
					contextProvider: this.__getContext
				}));
		}
	},


	onStoreChange () {
		let id = this.getPageID();
		let page = Store.getPageDescriptor(id);
		let pageSource = page.getPageSource(this.getRootID());

		this.setPageSource(pageSource, id);
		this.setState({
			currentPage: id,
			loading: false,
			page: page,
			pageSource
		});
	},


	getBodyParts () {
		var page = this.state.page;
		if (page) {
			return page.getBodyParts();
		}
	},


	getPageStyles () {
		var page = this.state.page;
		if (page) {
			return page.getPageStyles();
		}
	},


	render () {
		var body = this.getBodyParts() || [];
		var pageSource = this.state.pageSource;

		if (this.state.loading) {
			return (<Loading/>);
		}

		return (
			<div className="content-view">

				{this.__applyStyle()}

				{this.renderAssessmentHeader()}

				<div id="NTIContent" className="nti-content-panel" onClick={this.onContentClick}
					dangerouslySetInnerHTML={{__html: body.map(this.buildBody).join('')}}/>

				{this.renderAssessmentFeedback()}

				{this.renderGlossaryEntry()}

				<Pager position="bottom" pageSource={pageSource} current={this.getPageID()}/>

				{this.renderAssessmentSubmission()}
			</div>
		);
	},


	buildBody (part) {

		if (typeof part === 'string') {
			return part;
		}

		this.createWidget(part);

		return '<widget id="'+ part.guid +'"><error>If this is still visible, something went wrong.</error></widget>';
	},


	__applyStyle () {
		var styles = this.getPageStyles() || [];
		return styles.map(css =>
			<style scoped type="text/css" key={guid()} dangerouslySetInnerHTML={{__html: css}}/>
		);
	},


	__getContext () {
		var getContextFromProvider = this.props.contextProvider || noContextProvider;

		return getContextFromProvider(this.props).then(context => {
			//TODO: have the Content Api resolve page title...
			context.push({
				label: '??Current Page??',
				href: location.href//current page doesn't need an href.(its the current one)
			});
			return context;
		});
	}
});

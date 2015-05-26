import {decodeFromURI} from 'nti.lib.interfaces/utils/ntiids';
import guid from 'nti.lib.interfaces/utils/guid';

import React from 'react';
import {RouterMixin} from 'react-router-component';

import Loading from 'common/components/Loading';
import Err from 'common/components/Error';

import StoreEvents from 'common/mixins/StoreEvents';
import ContextSender from 'common/mixins/ContextSender';

import Pager from 'common/components/Pager';


import {getWidget} from './widgets';


import Store from '../Store';
import {loadPage} from '../Actions';
import PageDescriptor from '../PageDescriptor';

import {RESOURCE_VIEWED} from 'nti.lib.interfaces/models/analytics/MimeTypes';

import AnalyticsBehavior from 'analytics/mixins/ResourceLoaded';
import RouterLikeBehavior from './viewer-parts/mock-router';
import GlossaryFeature from './viewer-parts/glossary';
import Interactions from './viewer-parts/interaction';
import AssessmentFeature from './viewer-parts/assessment';
import AnnotationFeature from './viewer-parts/annotations';
import BodyContent from './viewer-parts/Content.jsx';

export default React.createClass({
	displayName: 'content:Viewer',
	mixins: [
		AnalyticsBehavior,
		AnnotationFeature,
		AssessmentFeature,
		ContextSender,
		GlossaryFeature,
		Interactions,
		RouterLikeBehavior,
		RouterMixin,
		StoreEvents
	],


	propTypes: {
		rootId: React.PropTypes.string,
		pageId: React.PropTypes.string,
		slug: React.PropTypes.string,
		contentPackage: React.PropTypes.object
	},

	backingStore: Store,
	backingStoreEventHandlers: {
		default: 'onStoreChange'
	},

	resumeAnalyticsEvents() {
		this.resourceLoaded(this.getPageID(), this.props.contentPackage.getID(), RESOURCE_VIEWED);
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
		this.resourceUnloaded();
		this.cleanupWidgets();
	},


	componentDidUpdate () {
		//See if we need to re-mount/render our components...
		let widgets = this.getPageWidgets();

		if (widgets && this.refs.content) {
			// console.debug('Content View: Did Update... %o', widgets);

			for(let id of Object.keys(widgets)) {
				let el = document.getElementById(id);
				let w = widgets[id];
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
		let widgets = this.getPageWidgets();

		for(let id of Object.keys(widgets)) {
			let el = document.getElementById(id);
			if (el) {
				React.unmountComponentAtNode(el);
				el.removeAttribute('mounted');
			}
		}
	},


	getDataIfNeeded (props) {
		let newPageId = this.getPageID(props);
		let newPage = newPageId !== this.state.currentPage;
		let newRoot = this.getRootID(props) !== this.getRootID();
		let initial = this.props === props;

		if (initial || newPage || newRoot) {
			this.cleanupWidgets();
			this.setState(
				Object.assign(
					{ currentPage: newPageId },
					this.getResetState()
				)
			);

			loadPage(newPageId);
			this.resourceLoaded(newPageId, this.props.contentPackage.getID(), RESOURCE_VIEWED);
		}
	},


	getRootID (props = this.props) {
		return decodeFromURI(props.rootId);
	},


	getPageID (props = this.props) {
		let h = this.getPropsFromRoute(props);
		return decodeFromURI(h.pageId || props.rootId);
	},


	getPageWidgets () {
		let o = this.state.pageWidgets;
		let id = this.getPageID();
		if (o && !o[id]) {
			//console.debug('Content View: Creating bin for PageWidgets for %s', id);
			o[id] = {};
		}
		return o && o[id];
	},


	createWidget (widgetData) {
		let widgets = this.getPageWidgets();
		if (!widgets[widgetData.guid]) {
			// console.debug('Content View: Creating widget for %s', widgetData.guid);
			widgets[widgetData.guid] = getWidget(
				widgetData,
				this.state.page,
				Object.assign({}, this.props, {
					contextResolver: this.resolveContext
				}));
		}
	},


	onStoreChange () {
		let id = this.getPageID();
		let page = Store.getPageDescriptor(id);
		let pageSource, pageTitle, error;

		if (page instanceof PageDescriptor) {
			pageSource = page.getPageSource(this.getRootID());
			pageTitle = page.getTitle();
		} else {
			error = page;
			page = undefined;
		}

		this.setPageSource(pageSource, id);
		this.setState({
			currentPage: id,
			loading: false,
			page,
			pageSource,
			pageTitle,
			error
		});
	},


	getBodyParts () {
		let page = this.state.page;
		if (page) {
			return page.getBodyParts();
		}
	},


	getPageStyles () {
		let page = this.state.page;
		if (page) {
			return page.getPageStyles();
		}
	},


	render () {
		let body = this.getBodyParts() || [];
		let {error, loading, pageSource} = this.state;
		let pageId = this.getPageID();

		if (loading) {
			return (<Loading/>);
		}
		else if (error) {
			return (<Err error={error}/>);
		}

		return (
			<div className="content-view">

				{this.applyStyle()}

				{this.renderAssessmentHeader()}

				<BodyContent id="NTIContent" ref="content"
					className="nti-content-panel"
					onClick={this.onContentClick}
					data-ntiid={pageId}
					data-page-ntiid={pageId}
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

		return `<widget id="${part.guid}"><error>If this is still visible, something went wrong.</error></widget>`;
	},


	applyStyle () {
		let styles = this.getPageStyles() || [];
		return styles.map(css =>
			<style scoped type="text/css" key={guid()} dangerouslySetInnerHTML={{__html: css}}/>
		);
	},


	getContext () {
		return Promise.resolve({
			label: this.state.pageTitle,
			ntiid: this.getPageID(),
			href: location.href//current page doesn't need an href.(its the current one)
		});
	}
});

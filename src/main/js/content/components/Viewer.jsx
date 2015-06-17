import React from 'react';

import {RouterMixin} from 'react-router-component';

import cx from 'classnames';

import {decodeFromURI} from 'nti.lib.interfaces/utils/ntiids';

import Loading from 'common/components/Loading';
import Err from 'common/components/Error';

import StoreEvents from 'common/mixins/StoreEvents';
import ContextSender from 'common/mixins/ContextSender';

import Pager from 'common/components/Pager';

import Store from '../Store';
import {loadPage} from '../Actions';
import PageDescriptor from '../PageDescriptor';

import {
	ASSIGNMENT_VIEWED,
	RESOURCE_VIEWED,
	SELFASSESSMENT_VIEWED
} from 'nti.lib.interfaces/models/analytics/MimeTypes';

import AnalyticsBehavior from 'analytics/mixins/ResourceLoaded';
import AnnotationFeature from './viewer-parts/annotations';
import AssessmentFeature, {isAssignment} from './viewer-parts/assessment';
import RouterLikeBehavior from './viewer-parts/mock-router';
import GlossaryFeature from './viewer-parts/glossary';
import Interactions from './viewer-parts/interaction';

import BodyContent from './Content';
import Gutter from './Gutter';
import Discussions from './discussions';

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

	signalResourceLoaded () {
		let {page} = this.state;
		let quiz = page && page.getSubmittableAssessment();
		let mime = quiz ? (isAssignment(quiz) ? ASSIGNMENT_VIEWED : SELFASSESSMENT_VIEWED) : RESOURCE_VIEWED;

		let args = [
			this.getPageID(),
			this.props.contentPackage.getID(),
			mime
		];

		if (quiz) {
			args.unshift(quiz.getID());
		}

		this.resourceLoaded.apply(this, args);
	},

	resumeAnalyticsEvents() {
		this.signalResourceLoaded();
	},

	getResetState () {
		return {
			loading: true,
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
	},


	componentWillReceiveProps (props) {
		this.getDataIfNeeded(props);
	},


	componentDidUpdate: function() {
		let {pageSource, currentPage} = this.state;
		this.setPageSource(pageSource, currentPage);
	},


	getDataIfNeeded (props) {
		let newPageId = this.getPageID(props);
		let newPage = newPageId !== this.state.currentPage;
		let newRoot = this.getRootID(props) !== this.getRootID();
		let initial = this.props === props;

		if (initial || newPage || newRoot) {
			this.setState(
				Object.assign(
					{ currentPage: newPageId },
					this.getResetState()
				)
			);

			loadPage(newPageId);
		}
	},


	getRootID (props = this.props) {
		return decodeFromURI(props.rootId);
	},


	getPageID (props = this.props) {
		let h = this.getPropsFromRoute(props);
		return decodeFromURI(h.pageId || props.rootId);
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

		this.setState({
			currentPage: id,
			loading: false,
			page,
			pageSource,
			pageTitle,
			error
		},
		()=> this.signalResourceLoaded());
	},


	setDiscussionFilter (selectedDiscussions) {
		this.setState({selectedDiscussions});
	},


	render () {
		let pageId = this.getPageID();
		let {contentPackage} = this.props;
		let {annotations, error, loading, page, pageSource, selectedDiscussions, style, className = ''} = this.state;
		let {discussions} = this.getPropsFromRoute();

		if (loading) {
			return (<Loading/>);
		}
		else if (error) {
			return (<Err error={error}/>);
		}

		let props = {
			className: cx('content-view', className.split(/\s+/)),
			style
		};

		if (!this.refs.content) {
			//Annotations cannot resolve their anchors if the content ref is not present... so don't even try.
			annotations = undefined;
		}

		return (
			<div {...props}>

				{discussions ? (

					<Discussions UserDataStoreProvider={page} filter={selectedDiscussions}/>

				) : (
					<div className="content-body">
						{this.renderAssessmentHeader()}

						<BodyContent id="NTIContent" ref="content"
							className="nti-content-panel"
							onClick={this.onContentClick}
							contentPackage={contentPackage}
							pageId={pageId}
							page={page}/>

						{this.renderAssessmentFeedback()}

						{this.renderGlossaryEntry()}

						<Pager position="bottom" pageSource={pageSource} current={this.getPageID()}/>

						<Gutter items={annotations} selectFilter={this.setDiscussionFilter}/>

						{this.renderAssessmentSubmission()}
					</div>
				)}
			</div>
		);
	},


	getContext () {
		return Promise.resolve({
			label: this.state.pageTitle,
			ntiid: this.getPageID(),
			href: this.makeHref('')
		});
	}
});

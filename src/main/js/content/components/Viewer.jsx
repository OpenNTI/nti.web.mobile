import React from 'react';
import TransitionGroup from 'react/lib/ReactCSSTransitionGroup';
import cx from 'classnames';

import {isFlag} from 'common/utils';

import {RouterMixin} from 'react-router-component';


import {decodeFromURI} from 'nti.lib.interfaces/utils/ntiids';

import Loading from 'common/components/Loading';
import Err from 'common/components/Error';

import StoreEvents from 'common/mixins/StoreEvents';
import ContextSender from 'common/mixins/ContextSender';

import Pager from 'common/components/Pager';

import ContentAquirePrompt from 'catalog/components/ContentAquirePrompt';

import Store from '../Store';
import {loadPage, resolveNewContext} from '../Actions';
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

import AnnotationBar from './AnnotationBar';
import NoteEditor from './NoteEditor';
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
		contentPackage: React.PropTypes.object,
		onPageLoaded: React.PropTypes.func
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


	resumeAnalyticsEvents () {
		this.signalResourceLoaded();
	},


	getDefaultProps () {
		return {
			onPageLoaded: () => {}
		};
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


	componentDidUpdate () {
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
		let {onPageLoaded} = this.props;

		if (!page) { //the event was not for this component.
			return;
		}

		if (page instanceof PageDescriptor) {
			pageSource = page.getPageSource(this.getRootID());
			pageTitle = page.getTitle();
		} else {
			error = page;
			page = undefined;
		}

		let pageLoaded = Promise.resolve(page);
		if (page) {
			pageLoaded = this.verifyContentPackage(page.pageInfo)
				.then(()=> onPageLoaded(page.pageInfo));
		}

		pageLoaded.then(()=> {

			this.setState({
				currentPage: id,
				loading: false,
				page,
				pageSource,
				pageTitle,
				error
			},

			()=> this.signalResourceLoaded());

		});
	},


	verifyContentPackage (pageInfo) {
		let {contentPackage} = this.props;
		let packageId = pageInfo.getPackageID();

		let fallback = p => p.getID() === packageId;
		let test = p => p.containsPackage ? p.containsPackage(packageId) : fallback(p);

		if (!test(contentPackage)) {
			console.debug('Cross-Referenced... need to redirect to a new context that contains: %s', packageId);
			return resolveNewContext(pageInfo);
		}

		return Promise.resolve();
	},


	setDiscussionFilter (selectedDiscussions) {
		this.setState({selectedDiscussions});
	},


	render () {
		let pageId = this.getPageID();
		let {contentPackage} = this.props;

		let {
			annotations, stagedNote, error, loading, page,
			pageSource, selectedDiscussions, style, className = ''
		} = this.state;

		let {discussions} = this.getPropsFromRoute();

		if (loading) {
			return (<Loading/>);
		}
		else if (error) {
			if (ContentAquirePrompt.shouldPrompt(error)) {
				return ( <ContentAquirePrompt data={error}/> );
			}

			return ( <Err error={error}/> );
		}

		let props = {
			className: cx('content-view', className.split(/\s+/)),
			style
		};

		if (!this.refs.content) {
			//Annotations cannot resolve their anchors if the
			//content ref is not present... so don't even try.
			annotations = undefined;
		}


		return (
			<TransitionGroup {...props} component="div"
				transitionName="fadeOutIn"
				transitionAppear>

				{discussions ? (

					<Discussions key="discussions" UserDataStoreProvider={page} filter={selectedDiscussions}/>

				) : stagedNote ? (

					this.renderNoteEditor()

				) : (
					<div className="content-body" key="content">
						{this.renderAssessmentHeader()}

						<BodyContent id="NTIContent" ref="content"
							className="nti-content-panel"
							onClick={this.onContentClick}
							onTouchEnd={this.maybeOfferAnnotations}
							contentPackage={contentPackage}
							pageId={pageId}
							page={page}/>

						{this.renderAssessmentFeedback()}

						{this.renderGlossaryEntry()}

						<Pager position="bottom" pageSource={pageSource} current={this.getPageID()}/>

						<Gutter items={annotations} selectFilter={this.setDiscussionFilter}/>

						{this.renderDockedToolbar()}
					</div>
				)}

			</TransitionGroup>
		);
	},


	renderDockedToolbar () {
		let annotation = this.renderAnnotationToolbar();
		let submission = this.renderAssessmentSubmission();

		let key = annotation
			? 'annotation'
			: submission
				? 'submission'
				: 'none';

		let content = annotation || submission;

		return (
			<TransitionGroup component="div" transitionName="toast" className={`fixed-footer ${key}`} transitionAppear>

				{content && (
				<div className={`the-fixed ${key}`} key={key}>
					{content}
				</div>
				)}

			</TransitionGroup>
		);
	},


	renderAnnotationToolbar () {
		const None = void 0;
		let {selected} = this.state;
		if (!selected || !isFlag('create-annotations')) {
			return null;
		}

		let isRange = selected instanceof Range;
		let isHighlight = !isRange && !selected.isNote;

		if (!isRange && !selected.isModifiable) {
			console.debug('Selected annotation is not modifiable: %o', selected);
			return null;
		}

		if (selected.isNote) { return null; } //don't deal with notes for now.

		let props = {
			item: isRange ? None : selected,
			onNewDiscussion: (isRange || isHighlight) ? this.createNote : None,
			onSetHighlight: isRange ? this.createHighlight : isHighlight ? this.updateHighlight : None,
			onRemoveHighlight: isHighlight ? this.removeHighlight : None
		};

		return (
			<AnnotationBar {...props}/>
		);
	},


	renderNoteEditor () {
		const cancel = ()=> this.setState({stagedNote: void 0});
		let {stagedNote} = this.state;

		if (!stagedNote) {
			return null;
		}

		return (
			<NoteEditor key="note-editor" item={stagedNote} onCancel={cancel} onSave={this.saveNote}/>
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

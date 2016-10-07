import React from 'react';
import TransitionGroup from 'react-addons-css-transition-group';
import cx from 'classnames';

import {RouterMixin} from 'react-router-component';

import Logger from 'nti-util-logger';
import {decodeFromURI} from 'nti-lib-ntiids';

import {Loading, Error as Err, Pager} from 'nti-web-commons';

import {StoreEventsMixin} from 'nti-lib-store';
import ContextSender from 'common/mixins/ContextSender';


import ContentAcquirePrompt from 'catalog/components/ContentAcquirePrompt';

import Store from '../Store';
import {loadPage, resolveNewContext} from '../Actions';
import PageDescriptor from '../PageDescriptor';

import {
	ASSIGNMENT_VIEWED,
	RESOURCE_VIEWED,
	SELFASSESSMENT_VIEWED,
	Mixin as AnalyticsBehavior
} from 'nti-analytics';
import AnnotationFeature from './viewer-parts/annotations';
import AssessmentFeature, {isAssignment} from './viewer-parts/assessment';
import RouterLikeBehavior from './viewer-parts/mock-router';
import GlossaryFeature from './viewer-parts/glossary';
import Interactions from './viewer-parts/interaction';
import PopUpFeature from './viewer-parts/popup';

import AnnotationBar from './AnnotationBar';
import NoteEditor from './NoteEditor';
import BodyContent from './Content';
import Gutter from './Gutter';
import Discussions from './discussions';

const logger = Logger.get('content:components:Viewer');

const TRANSITION_TIMEOUT = 300;

export default React.createClass({
	displayName: 'content:Viewer',
	mixins: [
		AnalyticsBehavior,
		AnnotationFeature,
		AssessmentFeature,
		ContextSender,
		GlossaryFeature,
		Interactions,
		PopUpFeature,
		RouterLikeBehavior,
		RouterMixin,
		StoreEventsMixin
	],


	propTypes: {
		rootId: React.PropTypes.string,
		pageId: React.PropTypes.string,
		contentPackage: React.PropTypes.object,
		pageSource: React.PropTypes.object, //used to specify a custom pager
		onPageLoaded: React.PropTypes.func,

		className: React.PropTypes.string
	},

	backingStore: Store,
	backingStoreEventHandlers: {
		default: 'onStoreChange'
	},


	signalResourceLoaded () {
		const quiz = this.getAssessment();
		const mime = quiz ? (isAssignment(quiz) ? ASSIGNMENT_VIEWED : SELFASSESSMENT_VIEWED) : RESOURCE_VIEWED;

		const args = [
			this.getPageID(),
			this.props.contentPackage.getID(),
			mime
		];

		if (quiz) {
			args.unshift(quiz.getID());
		}

		this.resourceLoaded(...args);
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
		//The DOM Node will always be the loading dom at his point...
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
		const {pageSource, currentPage} = this.state;
		//We transition between discussions, NoteEditor and content...
		//those transitions delay "componentWillUnmount" which is one of the
		//places where context book-keeping is performed... wait for it to occur.
		setTimeout(() =>
			this.setPageSource(pageSource, currentPage), TRANSITION_TIMEOUT);
	},


	getDataIfNeeded (props) {
		const newPageId = this.getPageID(props);
		const newPage = newPageId !== this.state.currentPage;
		const newRoot = this.getRootID(props) !== this.getRootID();
		const initial = this.props === props;

		if (initial || newPage || newRoot) {
			this.setState({
				currentPage: newPageId,
				...this.getResetState()
			}, () =>
				loadPage(newPageId, props.contentPackage)
			);
		}
	},


	getRootID (props = this.props) {
		return decodeFromURI(props.rootId);
	},


	getPageID (props = this.props) {
		const h = this.getPropsFromRoute(props);
		return decodeFromURI(h.pageId || props.rootId);
	},


	onStoreChange () {
		const id = this.getPageID();
		let page = Store.getPageDescriptor(id);
		let {pageSource, onPageLoaded} = this.props;
		let pageTitle, error;

		if (!page) { //the event was not for this component.
			return;
		}



		if (page instanceof PageDescriptor) {
			if (!pageSource) {
				pageSource = page.getPageSource(this.getRootID());
			}
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


	attachContentRef (ref) {
		this.content = ref;
	},


	verifyContentPackage (pageInfo) {
		const {contentPackage} = this.props;
		const packageId = pageInfo.getPackageID();

		const fallback = p => p.getID() === packageId;
		const test = p => p.containsPackage ? p.containsPackage(packageId) : fallback(p);

		if (!test(contentPackage)) {
			logger.debug('Cross-Referenced... need to redirect to a new context that contains: %s', packageId);
			return resolveNewContext(pageInfo);
		}

		return Promise.resolve();
	},


	setDiscussionFilter (selectedDiscussions) {
		this.setState({selectedDiscussions});
	},


	render () {
		const {contentPackage, className} = this.props;

		const {
			annotations, stagedNote, error, loading, page,
			selectedDiscussions, style
		} = this.state;

		const {discussions} = this.getPropsFromRoute();

		if (loading) {
			return (<Loading.Mask />);
		}
		else if (error) {
			if (ContentAcquirePrompt.shouldPrompt(error)) {
				return ( <ContentAcquirePrompt data={error}/> );
			}

			return ( <Err error={error}/> );
		}

		const props = {
			className: cx('content-view', className, {
				'note-editor-open': !!stagedNote
			}),
			style
		};


		//Annotations cannot resolve their anchors if the
		//content ref is not present... so don't even try.
		const gutterItems = this.content ? annotations : void 0;


		return (
			<TransitionGroup {...props} component="div"
				transitionName="fadeOutIn"
				transitionEnterTimeout={TRANSITION_TIMEOUT}
				transitionLeaveTimeout={TRANSITION_TIMEOUT}
				>

				{discussions ? (

					<Discussions key="discussions"
						UserDataStoreProvider={page}
						contentPackage={contentPackage}
						filter={selectedDiscussions}
						/>

				) : stagedNote ? (

					this.renderNoteEditor()

				) : (
					<div key="content" ref={x => this.node = x}>
						<div className="content-body">
							{this.renderAssessmentHeader()}
							<div className="coordinate-root">
								<BodyContent ref={this.attachContentRef}
									onClick={this.onContentClick}
									onUserSelectionChange={this.maybeOfferAnnotations}
									contentPackage={contentPackage}
									pageId={page.getCanonicalID()}
									page={page}/>

								{this.renderAssessmentFeedback()}

								{this.renderGlossaryEntry()}

								{this.renderPopUp()}

								{this.renderBottomPager()}

								<Gutter items={gutterItems} selectFilter={this.setDiscussionFilter}/>
							</div>
						</div>
						{this.renderDockedToolbar()}
					</div>
				)}

			</TransitionGroup>
		);
	},

	renderBottomPager () {
		return isAssignment(this.getAssessment())
			? null
			: <Pager position="bottom" pageSource={this.state.pageSource} current={this.getPageID()}/>;
	},


	renderDockedToolbar () {
		const annotation = this.renderAnnotationToolbar();
		const submission = this.renderAssessmentSubmission();

		const key = annotation
			? 'annotation'
			: submission
				? 'submission'
				: 'none';

		const content = annotation || submission;

		return (
			<TransitionGroup component="div"
				transitionName="toast" className={`fixed-footer ${key}`}
				transitionAppearTimeout={500}
				transitionEnterTimeout={500}
				transitionLeaveTimeout={500}
				transitionAppear>

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
		const {selected} = this.state;
		if (!selected || isAssignment(this.getAssessment())) {
			return null;
		}

		const isRange = selected instanceof Range;
		const isHighlight = !isRange && !selected.isNote;

		if (!isRange && !selected.isModifiable) {
			logger.debug('Selected annotation is not modifiable: %o', selected);
			return null;
		}

		if (selected.isNote) { return null; } //don't deal with notes for now.

		const props = {
			item: isRange ? None : selected,
			range: isRange ? selected : None,
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
		const {stagedNote} = this.state;

		if (!stagedNote) {
			return null;
		}

		return (
			<NoteEditor key="note-editor"
				scope={this.props.contentPackage}
				item={stagedNote}
				onCancel={cancel}
				onSave={this.saveNote}/>
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

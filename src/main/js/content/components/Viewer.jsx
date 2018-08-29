import PropTypes from 'prop-types';
import React from 'react';
import createReactClass from 'create-react-class';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import cx from 'classnames';
import {RouterMixin} from 'react-router-component';
import Logger from '@nti/util-logger';
import {equals} from '@nti/lib-commons';
import {decodeFromURI} from '@nti/lib-ntiids';
import {Loading, Error as Err } from '@nti/web-commons';
import {StoreEventsMixin} from '@nti/lib-store';
import {ViewEvent} from '@nti/web-session';
import { PageDescriptor } from '@nti/lib-content-processing';

import ContextSender from 'common/mixins/ContextSender';
import ContentAcquirePrompt from 'catalog/components/ContentAcquirePrompt';

import Store from '../Store';
import {loadPage, resolveNewContext} from '../Actions';

import AnnotationFeature from './viewer-parts/annotations';
import AssessmentFeature, {isAssignment, isSurvey} from './viewer-parts/assessment';
import RouterLikeBehavior from './viewer-parts/mock-router';
import GlossaryFeature from './viewer-parts/glossary';
import Interactions from './viewer-parts/interaction';
import PopUpFeature from './viewer-parts/popup';
import AnnotationBar from './AnnotationBar';
import NoteEditor from './NoteEditor';
import BodyContent from './Content';
import Gutter from './Gutter';
import Discussions from './discussions';
import BottomPager from './BottomPager';

const logger = Logger.get('content:components:Viewer');

const getCourse = x => (!x || x.isCourse) ? x : x.parent('isCourse');

const TRANSITION_TIMEOUT = 300;

const Fade = (props) => ( <CSSTransition classNames="fade-out-in" timeout={TRANSITION_TIMEOUT} {...props}/> );

export default createReactClass({
	displayName: 'content:Viewer',
	mixins: [
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
		rootId: PropTypes.string,
		pageId: PropTypes.string,
		contentPackage: PropTypes.object,
		pageSource: PropTypes.object, //used to specify a custom pager
		onPageLoaded: PropTypes.func,

		className: PropTypes.string
	},

	backingStore: Store,
	backingStoreEventHandlers: {
		default: 'onStoreChange'
	},


	getAnalyticsData () {
		const {contentPackage} = this.props;
		const quiz = this.getAssessment();
		const type = !quiz ? 'ResourceView' : (
			isAssignment(quiz)
				? 'AssignmentView'
				: isSurvey(quiz)
					? 'SurveyView'
					: 'AssessmentView'
		);

		const assessmentId = quiz && quiz.getID();
		const rootContextId = contentPackage.getID();

		const course = getCourse(contentPackage);
		const courseId = course && course.getID();

		const resourceId = this.getPageID();

		return {
			type,
			resourceId: assessmentId || resourceId,
			ContentID: resourceId,
			rootContextId: courseId || rootContextId,
			context: this.resolveContext() //<= async (Promise)
		};
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
		this.getDataIfNeeded();
	},


	componentDidUpdate (prevProps, prevState) {
		this.getDataIfNeeded();

		const getComparable = ({pageSource, currentPage}) => ({currentPage, pageSource});

		const current = getComparable(this.state);
		const previous = getComparable(prevState);

		if (!equals(current, previous)) {
			const {currentPage, pageSource} = this.state;
			//We transition between discussions, NoteEditor and content...
			//those transitions delay "componentWillUnmount" which is one of the
			//places where context book-keeping is performed... wait for it to occur.
			clearTimeout(this.cdupTimout);
			this.cdupTimout = setTimeout(
				() => (
					delete this.cdupTimout,
					this.setPageSource(pageSource, currentPage)
				),
				TRANSITION_TIMEOUT
			);
		}
	},


	getDataIfNeeded (props = this.props) {
		const pageId = this.getPageID(props);
		const rootId = this.getRootID(props);
		const { currentPage, currentRoot } = this.state;
		const newPage = pageId !== currentPage;
		const newRoot = rootId !== currentRoot;

		if (newPage || newRoot) {
			this.setState({
				currentRoot: rootId,
				currentPage: pageId,
				...this.getResetState()
			}, () =>
				loadPage(pageId, props.contentPackage, props)
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
			});

		});
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


	handleContentUpdate () {
		if (this.gutter) {
			this.gutter.handleContentUpdate();
		}
	},


	renderGroupContents () {
		const {contentPackage} = this.props;

		const {
			annotations, stagedNote, page,
			selectedDiscussions
		} = this.state;

		const {discussions} = this.getPropsFromRoute();

		if(discussions) {
			return (
				<Fade key="discussions">
					<Discussions
						UserDataStoreProvider={page}
						contentPackage={contentPackage}
						filter={selectedDiscussions}
					/>
				</Fade>
			);
		}

		if(stagedNote) {
			return (
				<Fade key="note-editor">
					{this.renderNoteEditor()}
				</Fade>
			);
		}

		//Annotations cannot resolve their anchors if the
		//content ref is not present... so don't even try.
		const gutterItems = this.content ? annotations : void 0;

		return (
			<Fade key="content">
				<div ref={x => this.node = x}>
					<ViewEvent {...this.getAnalyticsData()}/>
					<div className="content-body">
						{this.renderAssessmentHeader()}
						<div className="coordinate-root">
							<BodyContent ref={x => this.content = x}
								onClick={this.onContentClick}
								onUserSelectionChange={this.maybeOfferAnnotations}
								onContentReady={this.handleContentUpdate}
								contentPackage={contentPackage}
								pageId={page.getCanonicalID()}
								page={page}/>

							{this.renderAssessmentFeedback()}

							{this.renderGlossaryEntry()}

							{this.renderPopUp()}

							<BottomPager contentPackage={contentPackage} rootId={this.getRootID()} currentPage={this.getPageID()} getAssessment={this.getAssessment} />

							<Gutter
								ref={x => this.gutter = x}
								items={gutterItems}
								selectFilter={this.setDiscussionFilter}
							/>
						</div>
					</div>
					{this.renderDockedToolbar()}
				</div>
			</Fade>
		);
	},


	render () {
		const {className} = this.props;

		const {
			stagedNote, error, loading, style
		} = this.state;

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

		return (
			<TransitionGroup {...props}>
				{this.renderGroupContents()}
			</TransitionGroup>
		);
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

		if(content) {
			return (
				<TransitionGroup className={`fixed-footer ${key}`}>
					<CSSTransition appear classNames="toast" timeout={500} key={key}>
						<div className={`the-fixed ${key}`}>
							{content}
						</div>
					</CSSTransition>
				</TransitionGroup>
			);
		}
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


	cancelNote () {
		this.setState({stagedNote: void 0});
	},


	renderNoteEditor () {
		const {stagedNote} = this.state;

		if (!stagedNote) {
			return null;
		}

		return (
			<NoteEditor
				scope={this.props.contentPackage}
				item={stagedNote}
				onCancel={this.cancelNote}
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

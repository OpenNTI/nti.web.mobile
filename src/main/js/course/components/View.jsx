import React from 'react';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import Router from 'react-router-component';
import {decodeFromURI} from 'nti-lib-ntiids';
import {Background, Error as ErrorWidget, Loading, Mixins, Presentation} from 'nti-web-commons';
import {StoreEventsMixin} from 'nti-lib-store';

import Assignments from 'assignment/components/View';
import NotFound from 'notfound/components/View';
import Redirect from 'navigation/components/Redirect';
import ContextContributor from 'common/mixins/ContextContributor';
import Invite from 'invitations/components/Send';
import Discussions from 'forums/components/View';

import {setCourse} from '../Actions';
import {LESSONS} from '../Sections';
import Store from '../Store';

import Page from './Page';
import CourseInfo from './CourseInfo';
import Lessons from './Lessons';
import Activity from './Activity';
import Media from './Media';
import ScormContent from './ScormContent';

const ROUTES = [
	{path: '/videos(/*)', handler: Page, pageContent: Media},
	{path: '/lessons(/*)', handler: Page, pageContent: Lessons},
	{path: '/discussions(/*)', handler: Page, pageContent: Discussions},
	{path: '/info', handler: Page, pageContent: CourseInfo},
	{path: '/activity(/*)', handler: Page, pageContent: Activity},
	{path: '/assignments(/*)', handler: Page, pageContent: Assignments},
	{path: '/invite(/*)', handler: Page, pageContent: Invite},
	{path: '/scormcontent(/*)', handler: Page, pageContent: ScormContent},
	{}//not found
];


export default createReactClass({
	displayName: 'CourseView',
	mixins: [Mixins.BasePath, ContextContributor, StoreEventsMixin],

	backingStore: Store,
	backingStoreEventHandlers: {
		default: 'synchronizeFromStore'
	},


	propTypes: {
		course: PropTypes.string.isRequired
	},


	getInitialState () { return { loading: true }; },


	synchronizeFromStore () {
		this.setState({loading: false, course: Store.getData()});
	},


	componentDidMount () { this.getDataIfNeeded(this.props); },


	componentWillUnmount () {
		setCourse(null);
	},


	componentWillReceiveProps (nextProps) {
		if (nextProps.course !== this.props.course) {
			this.getDataIfNeeded(nextProps);
		}
	},


	getDataIfNeeded (props) {
		const {course} = this.state;
		const currentId = course && course.getID();
		let courseId = decodeFromURI(props.course);
		if (courseId !== currentId) {
			this.setState({loading: true});
			setCourse(courseId);
		}
	},


	getCourse (strict = true) {
		let {course} = this.state;
		return (course || {}).CourseInstance || (strict ? null : course);
	},


	render () {
		const course = this.getCourse();
		const entry = course && course.CatalogEntry;

		if (this.state.loading) {
			return (<Loading.Mask />);
		}

		if ((course && course.error) || !entry) {
			return !course || course.notFound ?
				(<NotFound/>) :
				(<ErrorWidget error={course.error}/>);
		}

		return (
			<Presentation.Asset propName="imgUrl" type="background" contentPackage={entry}>
				<Background imgUrl={course.getPresentationProperties().background || '/mobile/resources/images/default-course/background.png'}>
					{this.renderContent()}
				</Background>
			</Presentation.Asset>
		);
	},


	renderContent () {
		const course = this.getCourse();
		return React.createElement(Router.Locations, {contextual: true},
			...ROUTES.map(route=>
				route.path ?
					React.createElement(Router.Location, Object.assign({course, contentPackage: course}, route)) :
					React.createElement(Router.NotFound, {handler: Redirect, location: LESSONS})
			));
	},


	getContext () {
		return Promise.resolve([
			{
				source: 'course/components/View',
				label: 'Courses',
				href: this.getBasePath(),
				//You may be asking why is this on this context node, instead of on the next level down...
				//The reason is to not repeat ourselves. Each route below this point would just echo this value,
				//so while this node points back to the library, it allows us a common point to supply a scope
				//for saving UGD.
				scope: this.getCourse(true)
			}
		]);
	}
});

import React from 'react';
import Router from 'react-router-component';

import {decodeFromURI} from 'nti-lib-ntiids';

import NotFound from 'notfound/components/View';

import Redirect from 'navigation/components/Redirect';

import Background from 'common/components/Background';
import {Loading} from 'nti-web-commons';
import {Error as ErrorWidget} from 'nti-web-commons';

import BasePathAware from 'common/mixins/BasePath';
import ContextContributor from 'common/mixins/ContextContributor';
import {StoreEventsMixin} from 'nti-lib-store';

import Page from './Page';

import {LESSONS} from '../Sections';

import Assignments from 'assignment/components/View';
//import Reports
import CourseInfo from './CourseInfo';
import Discussions from 'forums/components/View';
import Lessons from './Lessons';
import Activity from './Activity';
import Media from './Media';
import Invite from 'invitations/components/Send';
import {setCourse} from '../Actions';
import Store from '../Store';


const ROUTES = [
	{path: '/videos(/*)', handler: Page, pageContent: Media},
	{path: '/lessons(/*)', handler: Page, pageContent: Lessons},
	{path: '/discussions(/*)', handler: Page, pageContent: Discussions},
	{path: '/info', handler: Page, pageContent: CourseInfo},
	{path: '/activity(/*)', handler: Page, pageContent: Activity},
	{path: '/assignments(/*)', handler: Page, pageContent: Assignments},
	{path: '/invite(/*)', handler: Page, pageContent: Invite},
	{}//not found
];


export default React.createClass({
	displayName: 'CourseView',
	mixins: [BasePathAware, ContextContributor, StoreEventsMixin],

	backingStore: Store,
	backingStoreEventHandlers: {
		default: 'synchronizeFromStore'
	},


	propTypes: {
		course: React.PropTypes.string.isRequired
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
			return (<Loading/>);
		}

		if ((course && course.error) || !entry) {
			return !course || course.notFound ?
			(<NotFound/>) :
			(<ErrorWidget error={course.error}/>);
		}

		return (
			<Background imgUrl={course.getPresentationProperties().background}>
				{this.renderContent()}
			</Background>
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

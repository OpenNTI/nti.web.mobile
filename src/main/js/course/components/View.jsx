import React from 'react';
import PropTypes from 'prop-types';
import Router from 'react-router-component';
import {decodeFromURI} from '@nti/lib-ntiids';
import {Background, Error as ErrorWidget, Loading, Presentation} from '@nti/web-commons';

import Assignments from 'assignment/components/ViewLoader';
import NotFound from 'notfound/components/View';
import Redirect from 'navigation/components/Redirect';
import {Component as ContextContributor} from 'common/mixins/ContextContributor';
import Invite from 'invitations/components/Send';
import Discussions from 'forums/components/View';

import {getCourse} from '../Actions';
import {LESSONS, INFO, SCORMCONTENT} from '../Sections';

import Page from './Page';
import Community from './community';
import CourseInfo from './CourseInfo';
import Lessons from './Lessons';
import Activity from './Activity';
import Media from './Media';
import ScormContent from './ScormContent';

const ROUTES = [
	{path: '/videos(/*)', handler: Page, pageContent: Media},
	{path: '/lessons(/*)', handler: Page, pageContent: Lessons},
	{path: '/community(/*)', handler: Page, pageContent: Community},
	{path: '/discussions(/*)', handler: Page, pageContent: Discussions},
	{path: '/info/invite(/*)', handler: Page, pageContent: Invite},
	{path: '/info(/*)', handler: Page, pageContent: CourseInfo},
	{path: '/activity(/*)', handler: Page, pageContent: Activity},
	{path: '/assignments(/*)', handler: Page, pageContent: Assignments},
	{path: '/scormcontent(/*)', handler: Page, pageContent: ScormContent},
	{}//not found
];


export default class CourseView extends React.Component {
	static propTypes = {
		course: PropTypes.string.isRequired
	}

	state = { loading: true }


	componentDidMount () { this.getDataIfNeeded(this.props); }


	componentDidUpdate (prevProps) {
		if (prevProps.course !== this.props.course) {
			this.getDataIfNeeded(this.props);
		}
	}


	async getDataIfNeeded (props) {
		let {course} = this.state;
		const currentId = course && course.getID();
		const courseId = decodeFromURI(props.course);

		if (courseId !== currentId) {
			this.currentCourseId = courseId;
			this.setState({loading: true});
			try {
				course = await getCourse(courseId);
			} catch (e) {
				course = {notFound: e.code === 404, error: e};
			}

			if (this.currentCourseId === courseId) {
				this.setState({course, loading: false});
			}
		}
	}


	getCourse = () => this.state.course;


	render () {
		const course = this.getCourse();
		const entry = course && course.CatalogEntry;

		const render = () => {
			if (this.state.loading) {
				return (<Loading.Mask />);
			}

			if ((course && course.error) || !entry) {
				return !course || course.notFound ?
					(<NotFound/>) :
					(<ErrorWidget error={course.error || {statusCode: 403}}/>);
			}

			// Background imgUrl props use to fall back to '/mobile/resources/images/default-course/background.png'
			return (
				<Presentation.Asset propName="imgUrl" type="background" contentPackage={entry}>
					<Background>
						{this.renderContent()}
					</Background>
				</Presentation.Asset>
			);
		};

		return (
			<ContextContributor getContext={getContext} course={course}>
				{render()}
			</ContextContributor>
		);
	}


	renderContent () {
		const course = this.getCourse();
		const {PreferredAccess} = course;
		const isScorm = PreferredAccess && PreferredAccess.isScorm;

		const entryPoint = course && course.CatalogEntry && course.CatalogEntry.Preview ? INFO : isScorm ? SCORMCONTENT : LESSONS;
		return React.createElement(Router.Locations, {contextual: true},
			...ROUTES.map(route=>
				route.path ?
					React.createElement(Router.Location, {course, contentPackage: course, ...route}) :
					React.createElement(Router.NotFound, {handler: Redirect, location: entryPoint})
			));
	}


}

async function getContext () {
	const context = this;//called with ContextContributor's scope.
	const {course} = context.props;
	const ntiid = course && course.getID && course.getID();

	return [
		{
			source: 'course/components/View',
			label: 'Courses',
			ntiid, // include course id in analytics event path,
			href: context.getBasePath(),
			//You may be asking why is this on this context node, instead of on the next level down...
			//The reason is to not repeat ourselves. Each route below this point would just echo this value,
			//so while this node points back to the library, it allows us a common point to supply a scope
			//for saving UGD.
			scope: context.props.course
		}
	];
}

import React from 'react';
import Router from 'react-router-component';

import {decodeFromURI} from 'nti.lib.interfaces/utils/ntiids';

import NotFound from 'notfound/components/View';

import Redirect from 'navigation/components/Redirect';

import Loading from 'common/components/Loading';
import ErrorWidget from 'common/components/Error';

import BasePathAware from 'common/mixins/BasePath';
import ContextContributor from 'common/mixins/ContextContributor';
import StoreEventAware from 'common/mixins/StoreEvents';

import Page from './Page';

import {LESSONS} from '../Sections';

//import Activity
//import Assignments
//import Reports
import CourseInfo from './CourseInfo';
import Discussions from 'forums/components/View';
import Lessons from './Lessons';
import Media from './Media';

import {setCourse} from '../Actions';
import Store from '../Store';


const ROUTES = [
	{path: '/videos(/*)', handler: Page, pageContent: Media},
	{path: '/lessons(/*)', handler: Page, pageContent: Lessons},
	{path: '/discussions(/*)', handler: Page, pageContent: Discussions},
	{path: '/info', handler: Page, pageContent: CourseInfo},
	{}//not found
];


export default React.createClass({
	displayName: 'CourseView',
	mixins: [BasePathAware, ContextContributor, StoreEventAware],

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


	componentWillUnmount () { setCourse(null); /*clear left nav*/ },


	componentWillReceiveProps (nextProps) {
		if (nextProps.course !== this.props.course) {
			this.getDataIfNeeded(nextProps);
		}
	},


	getDataIfNeeded (props) {
		let courseId = decodeFromURI(props.course);
		this.setState({loading: true});

		setCourse(courseId);
	},


	getCourse (strict = true) {
		let {course} = this.state;
		return (course || {}).CourseInstance || (strict ? null : course);
	},


	render () {
		let course = this.getCourse();
		let entry = course && course.CatalogEntry;

		if (this.state.loading) {
			return (<Loading/>);
		}

		if ((course && course.error) || !entry) {
			return course.notFound ?
				(<NotFound/>) :
				(<ErrorWidget error={course.error}/>);
		}

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

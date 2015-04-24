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
	{path: '/v(/*)', handler: Page, pageContent: Media},
	{path: '/o(/*)', handler: Page, pageContent: Lessons},
	{path: '/d(/*)', handler: Page, pageContent: Discussions},
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


	render () {
		let record = this.state.course;
		let course = (record || {}).CourseInstance;
		let entry = course && course.CatalogEntry;

		if (this.state.loading) {
			return (<Loading/>);
		}

		if ((record && record.error) || !course || !entry) {
			return record.notFound ?
				(<NotFound/>) :
				(<ErrorWidget error={record.error}/>);
		}

		return React.createElement(Router.Locations, {contextual: true},
			...ROUTES.map(route=>
				route.path ?
				React.createElement(Router.Location, Object.assign({}, route, {course})) :
				React.createElement(Router.NotFound, {handler: Redirect, location: 'o/'})
			));
	},


	getContext () {
		return Promise.resolve([
			{
				source: 'course/components/View',
				label: 'Courses',
				href: this.getBasePath()
			}/*,{
				label: 'Course Index',

			}*/
		]);
	}
});

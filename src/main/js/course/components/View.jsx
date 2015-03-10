import path from 'path';

import {decodeFromURI} from 'dataserverinterface/utils/ntiids';

import React from 'react';
import Router from 'react-router-component';

import NotFound from 'notfound/components/View';

import Redirect from 'navigation/components/Redirect';

import Loading from 'common/components/Loading';
import ErrorWidget from 'common/components/Error';

import BasePathAware from 'common/mixins/BasePath';
import StoreEventAware from 'common/mixins/StoreEvents';
import SetStateSafely from 'common/mixins/SetStateSafely';

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
	mixins: [BasePathAware, StoreEventAware, SetStateSafely],

	backingStore: Store,
	backingStoreEventHandlers: {
		default: 'synchronizeFromStore'
	},


	propTypes: {
		course: React.PropTypes.string.isRequired
	},


	getInitialState () { return { loading: true }; },


	synchronizeFromStore () {
		this.setStateSafely({loading: false, course: Store.getData()});
	},


	componentDidMount () { this.getDataIfNeeded(this.props); },


	componentWillUnmount () { setCourse(null); /*clear left nav*/ },


	componentWillReceiveProps (nextProps) {
		if (nextProps.course !== this.props.course) {
			this.getDataIfNeeded(nextProps);
		}
	},


	getDataIfNeeded (props) {
		var courseId = decodeFromURI(props.course);
		this.setStateSafely({loading: true});

		setCourse(courseId);
	},


	render () {
		var record = this.state.course;
		var course = (record || {}).CourseInstance;
		var entry = course && course.CatalogEntry;

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
				<Router.Location {...route}

					course={course}
					contextProvider={this.getContext}
					/> :
				<Router.NotFound handler={Redirect} location="o/" />
			));
	},


	/**
	 * Resolves the current context given the props from the direct decendent
	 * that asks.
	 *
	 * @param {Object} props The props set from the handler of the route.
	 */
	getContext (props) {
		let record = this.state.course;
		let course = (record || {}).CourseInstance;
		let presentation = course.getPresentationProperties();
		let leafId = props.videoId || props.rootId;

		let base = [
			{
				label: 'Courses',
				href: this.getBasePath()
			}, {
				ntiid: course.getID(),
				label: presentation.title,
				href: path.join(this.getBasePath(), 'course', this.props.course, '/o/')
			}
		];



		if (!props.outlineId) {
			if (leafId) {
				base = base.concat([{ntiid: leafId}]);
			}

			return Promise.resolve(base);
		}

		return course.getOutlineNode(decodeFromURI(props.outlineId))
			.then(o => base.concat([
					{
						ntiid: o.getID(),
						label: o.title,
						href: path.join(this.getBasePath(), o.href)
					}
				]))
			.then(o => leafId ? o.concat([{ntiid: decodeFromURI(leafId)}]) : o);
	}
});

import path from 'path';

import NTIID from 'dataserverinterface/utils/ntiids';
import React from 'react';
import Router from 'react-router-component';

import NotFound from 'notfound/components/View';

import CourseInfo from './CourseDescription';
import Loading from 'common/components/Loading';
import ErrorWidget from 'common/components/Error';

import BasePathAware from 'common/mixins/BasePath';
import StoreEventAware from 'common/mixins/StoreEvents';
import SetStateSafely from 'common/mixins/SetStateSafely';

import Media from './Media';
import Outline from './OutlineView';
import Overview from './Overview';
import Page from './Page';

import ContentViewer from 'content/components/Viewer';
import Discussions from 'forums/components/View';

import {setCourse} from '../Actions';
import Store from '../Store';


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
		var courseId = NTIID.decodeFromURI(props.course);
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

		return (
			<Router.Locations contextual>
				<Router.Location path="/v/(:videoId)(/*)"
									handler={Media}
									course={course}
									contextProvider={this.getContext}/>

				<Router.Location path="/o(/*)"
									handler={Lessons}
									course={course}
									contextProvider={this.getContext}/>

				<Router.Location path="/d(/*)"
									handler={Discussions}
									course={course}
									contextProvider={this.getContext}/>

				<Router.NotFound handler={CourseInfo} entry={entry} />
			</Router.Locations>
		);
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
			if (props.videoId) {
				base = base.concat([{ntiid: props.videoId}]);
			}

			return Promise.resolve(base);
		}

		return course.getOutlineNode(NTIID.decodeFromURI(props.outlineId))
			.then(o => base.concat([
					{
						ntiid: o.getID(),
						label: o.title,
						href: path.join(this.getBasePath(), o.href)
					}
				]));
	}
});


var Lessons = React.createClass({

	render () {
		let {course, contextProvider} = this.props;
		return (
				<Router.Locations contextual>
					<Router.Location path="/:outlineId/c/:rootId(/*)"
							handler={Page}
							pageContent={ContentViewer}
							contentPackage={course}
							contextProvider={contextProvider}
							slug="c"
							/>

					<Router.Location path="/:outlineId/v/:videoId(/*)"
							handler={Page}
							pageContent={Media}
							course={course}
							contextProvider={contextProvider}
							slug="v"
							/>

					<Router.Location path="/:outlineId(/*)"
							handler={Page}
							pageContent={Overview}
							course={course}
							contextProvider={contextProvider}
							/>

					<Router.NotFound handler={Page}
						pageContent={Outline}
						item={course}
						contextProvider={contextProvider} />
				</Router.Locations>
		);
	}
});

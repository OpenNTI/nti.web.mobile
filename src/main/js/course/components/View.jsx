import path from 'path';

import NTIID from 'dataserverinterface/utils/ntiids';
import React from 'react';
import Router from 'react-router-component';

import NotFound from 'notfound/components/View';

import CourseDescription from './CourseDescription';
import Loading from 'common/components/Loading';
import ErrorWidget from 'common/components/Error';

import BasePathAware from 'common/mixins/BasePath';
import StoreEventAware from 'common/mixins/StoreEvents';
import SetStateSafely from 'common/mixins/SetStateSafely';

import Media from './Media';
import Outline from './OutlineView';
import Overview from './Overview';

import ContentViewer from 'content/components/Viewer';
import ForumView from 'forums/components/View';

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
									contextProvider={this.__getContext}/>

				<Router.Location path="/o/:outlineId/c/:rootId(/*)"
									handler={ContentViewer}
									contentPackage={course}
									slug="c"
									contextProvider={this.__getContext}/>

				<Router.Location path="/o/:outlineId(/*)"
									handler={Overview}
									course={course}
									contextProvider={this.__getContext}/>

				<Router.Location path="/o(/*)"
									handler={Outline}
									item={course}/>

				<Router.Location path="/d(/*)"
									handler={ForumView}
									course={course}
									contextProvider={this.__getContext}/>

				<Router.NotFound handler={CourseDescription} entry={entry} noBack/>
			</Router.Locations>
		);
	},


	/**
	 * Resolves the current context given the props from the direct decendent
	 * that asks.
	 *
	 * @param {Object} props The props set from the handler of the route.
	 */
	__getContext (props) {
		var record = this.state.course;
		var course = (record || {}).CourseInstance;
		var presentation = course.getPresentationProperties();

		var base = {
			ntiid: course.getID(),
			label: presentation.label,
			href: path.join(this.getBasePath(), 'course', this.props.course, '/')
		};

		if (props.videoId && !props.outlineId) {
			return Promise.resolve([
				base,
				{
					ntiid: props.videoId
				}
			]);
		}

		return course.getOutlineNode(NTIID.decodeFromURI(props.outlineId))
			.then(o => [
					base,
					{
						ntiid: o.getID(),
						label: o.title,
						href: path.join(this.getBasePath(), o.href)
					}
				]);
	}
});

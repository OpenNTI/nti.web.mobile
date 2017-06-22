import React from 'react';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import Router from 'react-router-component';
import {decodeFromURI} from 'nti-lib-ntiids';
import Logger from 'nti-util-logger';
import {EmptyList, Loading, Mixins} from 'nti-web-commons';

import ContextContributor from 'common/mixins/ContextContributor';
import CourseLinker from 'library/mixins/CourseContentLink';

import {LESSONS, VIDEOS} from '../Sections';

import TranscriptedVideo from './TranscriptedVideo';
import VideoGrid from './VideoGrid';


const logger = Logger.get('course:components:Media');

export default createReactClass({
	displayName: 'MediaView',
	mixins: [CourseLinker, Mixins.NavigatableMixin, ContextContributor],

	propTypes: {
		outlineId: PropTypes.string,
		course: PropTypes.object.isRequired
	},

	getInitialState () {
		return {
			loading: true, error: false, VideoIndex: null
		};
	},


	componentDidMount () {
		this.getDataIfNeeded(this.props);
	},


	componentWillUnmount () {},


	componentWillReceiveProps (nextProps) {
		if (nextProps.course !== this.props.course) {
			this.getDataIfNeeded(nextProps);
		}
	},


	onError (error) {
		this.setState({
			loading: false,
			error: error,
			videoIndex: null
		});
	},


	getDataIfNeeded (props) {
		this.setState(this.getInitialState());
		try {
			props.course.getMediaIndex()
				.then(MediaIndex => this.setState({ loading: false, MediaIndex }))
				.catch(this.onError);
		} catch (e) {
			this.onError(e);
		}
	},


	getContext () {
		let {outlineId, course} = this.props;

		if (outlineId) {
			let id = decodeFromURI(outlineId);
			return course.getOutlineNode(id)
				.then(node=>({
					ntiid: id,
					label: node.label,
					// ref: node.ref,
					scope: node,//for UGD
					href: this.courseHref(course.getID(), LESSONS) + node.ref + '/'
				}),
				//error
				() => {
					logger.warn('Could not find outline node: %s in course: ', id, course.getID());
				});
		}

		return Promise.resolve([
			{
				label: 'Videos',
				href: this.makeHref(VIDEOS)
			}
		]);
	},


	render () {
		let {loading, error, MediaIndex} = this.state;

		if (loading) { return ( <Loading.Mask /> ); }
		if (error) {
			return ( <EmptyList type="videos"/> );
		}

		let props = Object.assign({}, this.props, { MediaIndex });

		return (
			<Router.Locations className="media-view" contextual>
				<Router.Location path="/:videoId/discussions(/*)" handler={TranscriptedVideo} {...props} showDiscussions/>
				<Router.Location path="/:videoId(/*)" handler={TranscriptedVideo} {...props}/>
				<Router.Location path="/(*)" handler={VideoGrid} {...props}/>
			</Router.Locations>
		);
	}
});

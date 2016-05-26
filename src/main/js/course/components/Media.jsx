import React from 'react';
import Router from 'react-router-component';

import {decodeFromURI} from 'nti-lib-ntiids';
import Logger from 'nti-util-logger';

import {Loading} from 'nti-web-commons';
import {EmptyList} from 'nti-web-commons';

import ContextContributor from 'common/mixins/ContextContributor';
import {Mixins} from 'nti-web-commons';
import CourseLinker from 'library/mixins/CourseContentLink';

import TranscriptedVideo from './TranscriptedVideo';
import VideoGrid from './VideoGrid';

import {LESSONS, VIDEOS} from '../Sections';

const logger = Logger.get('course:components:Media');

export default React.createClass({
	displayName: 'MediaView',
	mixins: [CourseLinker, Mixins.NavigatableMixin, ContextContributor],

	propTypes: {
		outlineId: React.PropTypes.string,
		course: React.PropTypes.object.isRequired
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

		if (loading) { return ( <Loading/> ); }
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

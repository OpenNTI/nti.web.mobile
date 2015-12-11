import React from 'react';
import Router from 'react-router-component';

import {decodeFromURI} from 'nti.lib.interfaces/utils/ntiids';

import Loading from 'common/components/Loading';
import EmptyList from 'common/components/EmptyList';

import ContextContributor from 'common/mixins/ContextContributor';
import NavigatableMixin from 'common/mixins/NavigatableMixin';
import CourseLinker from 'library/mixins/CourseContentLink';

import TranscriptedVideo from './TranscriptedVideo';
import VideoGrid from './VideoGrid';

import {LESSONS, VIDEOS} from '../Sections';

export default React.createClass({
	displayName: 'MediaView',
	mixins: [CourseLinker, NavigatableMixin, ContextContributor],

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
			props.course.getVideoIndex()
				.then(VideoIndex =>
					this.setState({
						loading: false,
						VideoIndex
					}))
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
					console.warn('Could not find outline node: %s in course: ', id, course.getID());
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
		let {loading, error, VideoIndex} = this.state;

		if (loading) { return ( <Loading/> ); }
		if (error) {
			return ( <EmptyList type="videos"/> );
		}

		let props = Object.assign({}, this.props, { VideoIndex });

		return (
			<Router.Locations className="media-view" contextual>
				<Router.Location path="/:videoId/discussions(/*)" handler={TranscriptedVideo} {...props} showDiscussions/>
				<Router.Location path="/:videoId(/*)" handler={TranscriptedVideo} {...props}/>
				<Router.Location path="/(*)" handler={VideoGrid} {...props}/>
			</Router.Locations>
		);
	}
});

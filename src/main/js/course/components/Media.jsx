import React from 'react';
import Router from 'react-router-component';

import {decodeFromURI} from 'nti.lib.interfaces/utils/ntiids';

import Loading from 'common/components/Loading';
import ErrorWidget from 'common/components/Error';

import BasePathAware from 'common/mixins/BasePath';
import SetStateSafely from 'common/mixins/SetStateSafely';
import ContextContributor from 'common/mixins/ContextContributor';
import NavigatableMixin from 'common/mixins/NavigatableMixin';

import TranscriptedVideo from './TranscriptedVideo';
import VideoGrid from './VideoGrid';


export default React.createClass({
	displayName: 'MediaView',
	mixins: [BasePathAware, NavigatableMixin, SetStateSafely, ContextContributor],

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
		this.setStateSafely({
			loading: false,
			error: error,
			videoIndex: null
		});
	},


	getDataIfNeeded (props) {
		this.setStateSafely(this.getInitialState());
		try {
			props.course.getVideoIndex()
				.then(VideoIndex =>
					this.setStateSafely({
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
			return course.getOutlineNode(id).then(node=>({
				ntiid: node.getID(),
				label: node.label,
				// ref: node.ref,
				href: this.getBasePath() + node.href
			}));
		}

		return Promise.resolve([
			{
				label: 'Videos',
				href: this.makeHref('v')
			}
		]);
	},


	render () {
		if (this.state.loading) { return (<Loading/>); }
		if (this.state.error) {	return (<ErrorWidget error={this.state.error}/>); }

		let {VideoIndex} = this.state;
		let props = Object.assign({}, this.props, { VideoIndex });

		return (
			<Router.Locations contextual>
				<Router.Location path="/:videoId(/*)" handler={TranscriptedVideo} {...props}/>
				<Router.Location path="/(*)" handler={VideoGrid} {...props}/>
			</Router.Locations>
		);
	}
});

import React from 'react';

import cx from 'classnames';

import {encodeForURI} from 'nti-lib-interfaces/lib/utils/ntiids';

import ContextSender from 'common/mixins/ContextSender';
import NavigatableMixin from 'common/mixins/NavigatableMixin';
import EmptyList from 'common/components/EmptyList';

//some notes: http://stackoverflow.com/questions/20870448/reactjs-modeling-bi-directional-infinite-scrolling
//I want to turn this into a buffered list.

const VideoCell = React.createClass({
	mixins: [NavigatableMixin],

	propTypes: {
		item: React.PropTypes.object
	},

	getInitialState () {
		return {};
	},


	componentDidMount () { this.fillIn(); },


	componentWillUpdate (nextProps) {
		if (this.props.item !== nextProps.item) {
			this.fillIn(nextProps);
		}
	},


	fillIn (props = this.props) {
		let {item} = props || {};

		function fallback (x) {
			let s = x && ((x.sources || [])[0] || {});
			return s.thumbnail || s.poster;
		}

		item.getThumbnail()
			.catch(()=> fallback(item))
			.then(poster => this.setState({poster}));
	},


	render () {
		const {state: {poster}, props: {item}} = this;
		const style = poster && { backgroundImage: `url(${poster})` };
		const thumbnail = cx('thumbnail', {resolving: !poster});
		const link = this.makeHref(encodeForURI(item.ntiid)) + '/';

		return (
			<li className="thumbnail-grid-item">
				<a title="Play" href={link}>
					<div className={thumbnail} style={style}/>
					<h3>{item.title}</h3>
				</a>
			</li>
		);
	}
});


export default React.createClass({
	displayName: 'VideoGrid',
	mixins: [ContextSender],

	propTypes: {
		VideoIndex: React.PropTypes.object
	},

	getContext () { return Promise.resolve([]); },

	render () {
		const {VideoIndex} = this.props;

		if(!VideoIndex || VideoIndex.length === 0) {
			return <EmptyList type="videos"/>;
		}

		return (
			<ul className="small-block-grid-1 medium-block-grid-2">
				{VideoIndex.map((v) => (
					<VideoCell index={VideoIndex} item={v} key={v.ntiid}/>
				))}
			</ul>
		);
	}
});

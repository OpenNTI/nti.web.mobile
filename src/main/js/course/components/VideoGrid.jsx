import React from 'react';

import cx from 'classnames';

import {encodeForURI} from 'nti-lib-ntiids';

import ContextSender from 'common/mixins/ContextSender';
import NavigatableMixin from 'common/mixins/NavigatableMixin';
import {EmptyList} from 'nti-web-commons';

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
		MediaIndex: React.PropTypes.object
	},

	getContext () { return Promise.resolve([]); },

	render () {
		const {MediaIndex} = this.props;

		if(!MediaIndex || MediaIndex.length === 0) {
			return <EmptyList type="videos"/>;
		}

		return (
			<ul className="small-block-grid-1 medium-block-grid-2">
				{MediaIndex.filter(x => x.isVideo).map((v) => (
					<VideoCell index={MediaIndex} item={v} key={v.ntiid}/>
				))}
			</ul>
		);
	}
});

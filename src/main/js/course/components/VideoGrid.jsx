import React from 'react';

import cx from 'classnames';

import {encodeForURI} from 'nti.lib.interfaces/utils/ntiids';

import ContextSender from 'common/mixins/ContextSender';
import NavigatableMixin from 'common/mixins/NavigatableMixin';
import EmptyList from 'common/components/EmptyList';

//some notes: http://stackoverflow.com/questions/20870448/reactjs-modeling-bi-directional-infinite-scrolling
//I want to turn this into a buffered list.

export default React.createClass({
	displayName: 'VideoGrid',
	mixins: [NavigatableMixin, ContextSender],

	propTypes: {
		course: React.PropTypes.object.isRequired,
		VideoIndex: React.PropTypes.object
	},


	getInitialState () {
		return {
			icons: {}
		};
	},


	getContext () { return Promise.resolve([]); },


	componentDidMount () {
		this.fillInIcons(this.props);
	},


	componentWillUnmount () {},


	componentWillReceiveProps (nextProps) {
		if (this.props.VideoIndex !== nextProps.VideoIndex) {
			this.fillInIcons(nextProps);
		}
	},


	fillInIcons (props) {
		let icons = {};
		let {VideoIndex} = props || {};

		function fallback (x) {
			let s = x && ((x.sources || [])[0] || {});
			return s.thumbnail || s.poster;
		}

		if (VideoIndex) {
			VideoIndex.map(v=>
				v.getThumbnail()
					.then(
						i=> icons[v.ntiid] = i,
						()=> icons[v.ntiid] = fallback(v)
					)
					.then(()=>this.setState({icons}))
				);
		}
	},


	render () {
		let {course, VideoIndex} = this.props;
		let {icons} = this.state;

		if(!VideoIndex || VideoIndex.length === 0) {
			return <EmptyList type="videos"/>;
		}

		return (
			<ul className="small-block-grid-1 medium-block-grid-2">
				{VideoIndex.map((v, i) => {
					let poster = icons[v.ntiid];

					let style = poster && { backgroundImage: `url(${poster})` };

					let thumbnail = cx('thumbnail', {resolving: !poster});

					let link = this.makeHref(encodeForURI(v.ntiid)) + '/';

					return (
						<li className="thumbnail-grid-item" key={v.ntiid + '-' + i}>
							<a title="Play" href={link}>
								<div className={thumbnail} style={style}/>
								<h3>{v.title}</h3>
							</a>
						</li>
					);
				})}
			</ul>
		);
	}
});

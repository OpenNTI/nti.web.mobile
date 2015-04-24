import React from 'react';

import {encodeForURI} from 'nti.lib.interfaces/utils/ntiids';

import path from 'path';

import BasePathAware from 'common/mixins/BasePath';
import ContextSender from 'common/mixins/ContextSender';

//some notes: http://stackoverflow.com/questions/20870448/reactjs-modeling-bi-directional-infinite-scrolling
//I want to turn this into a buffered list.

export default React.createClass({
	displayName: 'VideoGrid',
	mixins: [BasePathAware, ContextSender],

	propTypes: {
		course: React.PropTypes.object.isRequired,
		VideoIndex: React.PropTypes.object.isRequired
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

		function fallback (x) {
			let s = x && ((x.sources || [])[0] || {});
			return s.thumbnail || s.poster;
		}

		props.VideoIndex.map(v=>
			v.getThumbnail()
				.then(
					i=> icons[v.ntiid] = i,
					()=> icons[v.ntiid] = fallback(v)
				)
				.then(()=>this.setState({icons}))
			);
	},


	render () {
		let basePath = this.getBasePath();
		let {course, VideoIndex} = this.props;
		let {icons} = this.state;

		return (
			<ul className="small-block-grid-1 medium-block-grid-2">
				{VideoIndex.map((v, i) => {
					let poster = icons[v.ntiid];

					let style = poster && { backgroundImage: `url(${poster})` };

					let link = path.join(
						basePath,
						'course', encodeForURI(course.getID()),
						'v', encodeForURI(v.ntiid)) + '/';

					return (
						<li className="thumbnail-grid-item" key={v.ntiid + '-' + i}>
							<a title="Play" href={link}>
								<div className="thumbnail" style={style}/>
								<h3>{v.title}</h3>
							</a>
						</li>
					);
				})}
			</ul>
		);
	}
});

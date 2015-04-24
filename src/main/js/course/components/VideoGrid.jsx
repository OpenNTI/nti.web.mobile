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
		VideoIndex: React.PropTypes.object.isRequired
	},


	getInitialState () {
		return {};
	},


	getContext () { return Promise.resolve([]); },


	componentDidMount () {},


	componentWillUnmount () {},


	componentWillReceiveProps (/*nextProps*/) {},


	render () {
		let basePath = this.getBasePath();
		let props = this.props;
		let Videos = props.VideoIndex;

		return (
			<ul className="small-block-grid-1 medium-block-grid-2">
				{Videos.map((v, i) => {
					let s = v && ((v.sources || [])[0] || {});
					let poster = s.thumbnail || s.poster;

					let style = poster && {
						backgroundImage: `url(${poster})`
					};

					let link = path.join(
						basePath,
						'course', encodeForURI(props.course.getID()),
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

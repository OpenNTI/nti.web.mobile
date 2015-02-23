import React from 'react';

import {encodeForURI} from 'dataserverinterface/utils/ntiids';

import path from 'path';

import BasePathAware from 'common/mixins/BasePath';

//some notes: http://stackoverflow.com/questions/20870448/reactjs-modeling-bi-directional-infinite-scrolling
//I want to turn this into a buffered list.

export default React.createClass({
	displayName: 'VideoGrid',
	mixins: [BasePathAware],

	propTypes: {
		VideoIndex: React.PropTypes.object.isRequired
	},


	getInitialState () {
		return {};
	},


	componentDidMount () {},


	componentWillUnmount () {},


	componentWillReceiveProps (/*nextProps*/) {},


	render () {
		var basePath = this.getBasePath();
		var props = this.props;
		var Videos = props.VideoIndex;

		function itr(v, i) {
			let s = v && ((v.sources || [])[0] || {});
			let poster = s.thumbnail || s.poster;
			let style = {
				backgroundImage: 'url(' + poster + ')'
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
		}

		return (
			<ul className="small-block-grid-1 medium-block-grid-2">
				{Videos.map(itr.bind(this))}
			</ul>
		);
	}
});

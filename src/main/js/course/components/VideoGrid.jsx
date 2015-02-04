import React from 'react/addons';

import {encodeForURI} from 'dataserverinterface/utils/ntiids';

import path from 'path';

import BasePathAware from 'common/mixins/BasePath';

module.exports = React.createClass({
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
			var poster = v && ((v.sources || [])[0] || {}).poster;
			var style = {
				backgroundImage: 'url(' + poster + ')'
			};

			var link = path.join(
				basePath,
				'course', encodeForURI(props.course.getID()),
				'v', encodeForURI(v.ntiid)) + '/';

			return (
				<li className="grid-item" key={v.ntiid + '-' + i}>
					<div className="flex-video widescreen video-wrap" style={style}>
						<a className="play-centered" title="Play" href={link}/>
					</div>
					<div className="metadata">
						<h3>{v.title}</h3>
					</div>
				</li>
			);
		}

		return (
			<ul className="small-block-grid-1 medium-block-grid-3 large-block-grid-4">
				{Videos.map(itr.bind(this))}
			</ul>
		);
	}
});

import React from 'react';
import {Component as Video} from 'video';


export default React.createClass({
	displayName: 'Title',

	render () {
		let {entry} = this.props;
		if (!entry) { return; }

		let videoSrc = entry.Video;
		let context = [entry.getID()];

		return (
			<div className={'header ' + (videoSrc ? 'with-video' : '')}>
				{videoSrc ?
					<div className="row">
						<div className="columns video-wrap">
							<Video src={videoSrc} context={context}/>
						</div>
					</div> : null}

				<div className="title">
					<div className="row">
						<div className="columns text">{entry.Title}</div>
					</div>
				</div>
			</div>
		);
	}
});

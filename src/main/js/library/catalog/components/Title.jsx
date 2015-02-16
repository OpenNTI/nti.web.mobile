import React from 'react';
import {Component as Video} from 'video';


export default React.createClass({
	displayName: 'Title',

	render () {
		var {entry} = this.props;
		if (!entry) {return;}

		var videoSrc = entry.Video;
		var context = [entry.getID()];

		return (
			<div className={'header ' + (videoSrc? 'with-video' : '')}>
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

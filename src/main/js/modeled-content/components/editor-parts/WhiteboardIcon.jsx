import React from 'react';

export default React.createClass({
	displayName: 'WhiteboardThumbnail',

	propTypes: {
		thumbnail: React.PropTypes.string.isRequired,
		scene: React.PropTypes.object.isRequired
	},

	render () {
		let {thumbnail, scene} = this.props;

		scene = JSON.stringify(scene) || '';

		return (
			<div contentEditable={false} className="body-divider whiteboard">
				<div className="whiteboard-wrapper">
					<script type="application/json" dangerouslySetInnerHTML={{__html: scene}}/>
					<img src={thumbnail} className="thumbnail" alt="Whiteboard Thumbnail" border="0"/>
					<div className="fill"/>
					{/*}
					<div className="centerer">
						<div className="edit">Edit</div>
					</div>
					{*/}
				</div>
			</div>
		);
	}
});

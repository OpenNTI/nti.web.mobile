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
			<div contentEditable="false" className="body-divider whiteboard" unselectable="on">
				<div className="whiteboard-wrapper" onClick="void(0)">
					<script type="application/json" dangerouslySetInnerHTML={{__html: scene}}/>
					<img src={thumbnail} className="wb-thumbnail" alt="Whiteboard Thumbnail" unselectable="on" border="0"/>
					<div className="fill" unselectable="on"/>
					<div className="centerer" unselectable="on">
						<div unselectable="on" className="edit"></div>
					</div>
				</div>
			</div>
		);
	}
});

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
			<object contentEditable={false} className="body-divider whiteboard" unselectable="on">
				<div className="whiteboard-wrapper" unselectable="on">
					<img src={thumbnail} className="thumbnail" alt="Whiteboard Thumbnail" border="0" unselectable="no"/>
					<div className="fill" unselectable="no"/>
					{/*}
					<div className="centerer" unselectable="no">
						<div className="edit" unselectable="no">Edit</div>
					</div>
					{*/}
					<script type="application/json" dangerouslySetInnerHTML={{__html: scene}}/>
				</div>
			</object>
		);
	}
});

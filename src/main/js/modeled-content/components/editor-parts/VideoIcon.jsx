import React from 'react';

export default React.createClass({
	displayName: 'VideoThumbnail',

	propTypes: {
		data: React.PropTypes.object.isRequired
	},

	render () {
		let {data} = this.props;

		data = JSON.stringify(data) || '';

		return (
			<object contentEditable={false} className="body-divider video" unselectable="on">
				<div className="video-icon" unselectable="on">
					<div className="fill" unselectable="on"/>
					{/*}
					<div className="centerer" unselectable="no">
						<div className="edit" unselectable="no">Edit</div>
					</div>
					{*/}
					<script type="application/json" dangerouslySetInnerHTML={{__html: data}}/>
				</div>
			</object>
		);
	}
});

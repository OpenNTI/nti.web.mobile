import React from 'react';
import WhiteboardRenderer from 'nti.lib.whiteboardjs/lib/Canvas';

import {BLANK_IMAGE} from 'common/constants/DataURIs';

function getDataURI (scene) {
	return WhiteboardRenderer.getThumbnail(scene);
}

export default React.createClass({
	displayName: 'WhiteboardPanel',

	propTypes: {
		scene: React.PropTypes.object.isRequired
	},


	getInitialState () {
		return {
			src: BLANK_IMAGE
		};
	},


	componentDidMount () {
		getDataURI(this.props.scene).then(src=> this.setState({src}));
	},


	componentWillReceiveProps (nextProps) {
		getDataURI(nextProps.scene).then(src=> this.setState({src}));
	},

	render () {
		return (
			<img src={this.state.src} alt="Whiteboard Thumbnail" className="whiteboard thumbnail"/>
		);
	}
});

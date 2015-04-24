import React from 'react';
import WhiteboardRenderer from 'nti.lib.whiteboardjs/lib/Canvas';

import {URL} from 'nti.lib.whiteboardjs/lib/utils';

import {BLANK_IMAGE} from 'common/constants/DataURIs';


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


	updateRender (scene) {
		let {src} = this.state;
		if (src) {
			URL.revokeObjectURL(src);
		}

		WhiteboardRenderer.getThumbnail(scene)
			.then(blob=> URL.createObjectURL(blob))
			.then(url=> this.setState({src: url}));
	},


	stopLongPressMenu (e) {
		e.preventDefault();
		e.stopPropagation();
	},


	componentDidMount () {
		this.updateRender(this.props.scene);
	},


	componentWillReceiveProps (nextProps) {
		this.updateRender(nextProps.scene);
	},


	componentWillUnmount () {
		URL.revokeObjectURL(this.state.src || '');
	},

	render () {
		let touches = {
			onTouchStart: this.stopLongPressMenu,
			onTouchMove: this.stopLongPressMenu,
			onTouchEnd: this.stopLongPressMenu,
			onTouchCancel: this.stopLongPressMenu
		};

		return (
			<img {...touches} src={this.state.src} alt="Whiteboard Thumbnail" className="whiteboard thumbnail"/>
		);
	}
});

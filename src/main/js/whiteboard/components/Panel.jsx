import React from 'react';
import WhiteboardRenderer from 'nti.lib.whiteboardjs/lib/Canvas';

export default React.createClass({
	displayName: 'WhiteboardPanel',

	propTypes: {
		scene: React.PropTypes.object.isRequired
	},


	componentDidMount () {
		let {scene} = this.props;
		let {surface} = this.refs;

		this.renderer = new WhiteboardRenderer(scene, surface.getDOMNode());
	},


	componentWillReceiveProps (nextProps) {
		this.renderer.updateData(nextProps.scene);
	},


	componentDidUpdate () {
		this.renderer.drawScene();
	},


	render () {
		return (
			<canvas ref="surface"/>
		);
	}
});

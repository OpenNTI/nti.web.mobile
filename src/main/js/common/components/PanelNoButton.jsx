import React from 'react';
import PanelButton from './PanelButton';

/**
 *	Renders an info panel with a link/button.
 */
export default React.createClass({
	displayName: 'PanelNoButton',

	propTypes: {
		children: React.PropTypes.any
	},

	render () {
		return (
			<PanelButton {...this.props}>
				{this.props.children}
			</PanelButton>
		);
	}

});

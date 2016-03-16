import React from 'react';

export default React.createClass({
	displayName: 'RemoveIcon',

	propTypes: {
		onClick: React.PropTypes.func.isRequired,
		index: React.PropTypes.number.isRequired
	},

	onClick () {
		const {onClick, index} = this.props;
		onClick && (index > -1) && onClick(index);
	},

	render () {
		return (
			<b onClick={this.onClick} className="remove icon-bold-x" />
		);
	}
});

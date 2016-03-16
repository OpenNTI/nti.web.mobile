import React from 'react';

export default React.createClass({
	displayName: 'InterestListItem',

	propTypes: {
		item: React.PropTypes.string.isRequired,
		onRemove: React.PropTypes.func.isRequired
	},

	remove () {
		this.props.onRemove(this.props.item);
	},

	render () {

		const {item} = this.props;

		return (
			<div className="string-item">
				{item}
				<b onClick={this.remove} className="remove icon-bold-x" />
			</div>
		);
	}
});

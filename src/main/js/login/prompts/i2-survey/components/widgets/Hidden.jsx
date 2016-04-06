import React from 'react';

export default React.createClass({
	displayName: 'Hidden',

	propTypes: {
		element: React.PropTypes.object.isRequired
	},

	render () {

		const {element} = this.props;

		if(!element) {
			return null;
		}

		return (
			<input type="hidden" name={element.name} value={element.value} />
		);
	}
});

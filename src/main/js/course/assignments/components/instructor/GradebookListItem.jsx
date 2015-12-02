import React from 'react';

export default React.createClass({
	displayName: 'GradebookListItem',

	propTypes: {
		item: React.PropTypes.object.isRequired // UserGradeBookSummary object
	},

	render () {

		const {item} = this.props;

		return (
			<li>{item.Username}</li>
		);
	}
});

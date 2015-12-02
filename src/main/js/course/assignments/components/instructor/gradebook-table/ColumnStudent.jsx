import React from 'react';

import Avatar from 'common/components/Avatar';
import DisplayName from 'common/components/DisplayName';

export default React.createClass({
	displayName: 'GradebookColumnStudent',

	statics: {
		label () {
			return 'Student';
		},
		className: 'col-student'
	},

	propTypes: {
		item: React.PropTypes.object.isRequired // UserGradeBookSummary object
	},

	render () {

		const {item} = this.props;

		return (
			<div>
				<Avatar entity={item.user} />
				<DisplayName entity={item.user} />
			</div>
		);
	}
});

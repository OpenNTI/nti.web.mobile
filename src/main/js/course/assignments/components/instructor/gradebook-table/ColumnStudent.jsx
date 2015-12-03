import React from 'react';

import Avatar from 'common/components/Avatar';
import DisplayName from 'common/components/DisplayName';

export default React.createClass({
	displayName: 'GradebookColumnStudent',

	statics: {
		label () {
			return 'Student';
		},
		className: 'col-student',
		sort: 'LastName'
	},

	propTypes: {
		item: React.PropTypes.object.isRequired // UserGradeBookSummary object
	},

	render () {

		const {item} = this.props;

		return (
			<div>
				<Avatar entity={item.user} suppressProfileLink />
				<DisplayName entity={item.user} suppressProfileLink />
			</div>
		);
	}
});

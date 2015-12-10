import React from 'react';

import Avatar from 'common/components/Avatar';
import DisplayName from 'common/components/DisplayName';

import ShowAvatars from '../mixins/ShowAvatarsChild';

export default React.createClass({
	displayName: 'GradebookColumnStudent',

	mixins: [ShowAvatars],

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
		const showAvatars = this.getShowAvatars();
		return (
			<a href={`./${encodeURIComponent(item.username)}/`}>
				{showAvatars && (<Avatar entity={item.user} suppressProfileLink />)}
				<DisplayName entity={item.user} suppressProfileLink />
			</a>
		);
	}
});

import React from 'react';
import BasePath from 'common/mixins/BasePath';

export default React.createClass({
	displayName: 'Breadcrumb',
	mixins: [BasePath],

	propTypes: {
		entity: React.PropTypes.object.isRequired
	},

	render () {
		let {entity} = this.props;
		return (
			<ul className="profile-top-controls-breadcrumb">
				<li><a href={`${this.getBasePath()}contacts/groups/`}>Groups</a></li>
				<li>{entity.displayName}</li>
			</ul>
		);
	}
});

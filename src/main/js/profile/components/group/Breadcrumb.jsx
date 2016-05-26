import React from 'react';
import {Mixins} from 'nti-web-commons';

export default React.createClass({
	displayName: 'Breadcrumb',
	mixins: [Mixins.BasePath],

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

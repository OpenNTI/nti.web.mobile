import React from 'react';
import {Avatar} from 'nti-web-commons';
import ProfileLink from 'profile/mixins/ProfileLink';


export default React.createClass({
	displayName: 'Mobile:Avatar',
	mixins: [ProfileLink],

	propTypes: {
		entity: React.PropTypes.oneOfType([
			React.PropTypes.object,
			React.PropTypes.string
		]),

		suppressProfileLink: React.PropTypes.bool,
	},

	onClick (e) {
		const {entity} = this.props;
		this.navigateToProfile(entity, e);
	},

	render () {
		const {suppressProfileLink, ...props} = this.props;

		return (
			<Avatar {...props} onClick={suppressProfileLink ? null : this.onClick}/>
		);
	}
});

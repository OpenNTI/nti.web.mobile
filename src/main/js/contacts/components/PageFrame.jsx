import React from 'react/addons';
import ActiveLink from 'common/components/ActiveLink';

export default React.createClass({
	displayName: 'Contacts:PageFrame',

	propTypes: {
		pageContent: React.PropTypes.any
	},

	render () {

		let Content = this.props.pageContent;

		return (
			<div className="contacts-page">
				<ul className="contacts-nav">
					<li><ActiveLink href="/users/">Users</ActiveLink></li>
					<li><ActiveLink href="/groups/">Groups</ActiveLink></li>
					<li><ActiveLink href="/lists/">DistributionLists</ActiveLink></li>
				</ul>
				<div className="contacts-page-content">
					<Content {...this.props} />
				</div>
			</div>
		);
	}
});

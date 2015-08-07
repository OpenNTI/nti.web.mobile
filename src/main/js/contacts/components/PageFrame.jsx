import React from 'react/addons';
import ActiveLink from 'common/components/ActiveLink';
import Page from 'common/components/Page';

export default React.createClass({
	displayName: 'Contacts:PageFrame',

	propTypes: {
		pageContent: React.PropTypes.any
	},

	render () {

		let Content = this.props.pageContent;

		return (
			<Page title="Contacts">
				<div className="contacts-page">
					<header>
						<ul className="contacts-nav">
							<li><ActiveLink href="/users/">Users</ActiveLink></li>
							<li><ActiveLink href="/groups/">Groups</ActiveLink></li>
							<li><ActiveLink href="/lists/">Distribution Lists</ActiveLink></li>
						</ul>
					</header>
					<div className="contacts-page-content">
						<Content {...this.props} />
					</div>
				</div>
			</Page>
		);
	}
});

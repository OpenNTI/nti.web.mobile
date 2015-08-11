import React from 'react/addons';
import ActiveLink from 'common/components/ActiveLink';
import Page from 'common/components/Page';

export default React.createClass({
	displayName: 'Contacts:PageFrame',

	propTypes: {
		pageContent: React.PropTypes.any
	},


	componentWillMount () {
		this.setState({menu: [
			{label: 'Contacts', href: '/'},
			{label: 'Groups', href: '/groups/'},
			{label: 'Distribution Lists', href: '/lists/'}
		]});
	},


	render () {
		let {menu} = this.state || {};
		let Content = this.props.pageContent;

		return (
			<Page title="Contacts" availableSections={menu}>
				<div className="contacts-page gradient-bg">
					<header>
						<ul className="contacts-nav">
							<li><ActiveLink href="/users/">Contacts</ActiveLink></li>
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

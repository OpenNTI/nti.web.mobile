import React from 'react/addons';
import ActiveState from 'common/components/ActiveState';
import Page from 'common/components/Page';
import {Link} from 'react-router-component';

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
							<li><ActiveState tag={Link} href="/users/">Contacts</ActiveState></li>
							<li><ActiveState tag={Link} href="/groups/">Groups</ActiveState></li>
							<li><ActiveState tag={Link} href="/lists/" hasChildren>Distribution Lists</ActiveState></li>
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

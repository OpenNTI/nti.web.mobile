import React from 'react';
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
		const {props: {pageContent: Content}, state: {menu}} = this;


		return (
			<Page title="Contacts" availableSections={menu}>
				<div className="contacts-page">
					<div className="contacts-page-content">
						<Content {...this.props} />
					</div>
				</div>
			</Page>
		);
	}
});

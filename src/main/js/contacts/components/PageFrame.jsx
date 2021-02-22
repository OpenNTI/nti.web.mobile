import React from 'react';
import PropTypes from 'prop-types';

import Page from 'common/components/Page';

export default class extends React.Component {
	static displayName = 'Contacts:PageFrame';

	static propTypes = {
		pageContent: PropTypes.any,
	};

	state = {};

	componentDidMount() {
		this.setState({
			menu: [
				{ label: 'Contacts', href: '/' },
				{ label: 'Groups', href: '/groups/' },
				{ label: 'Distribution Lists', href: '/lists/' },
			],
		});
	}

	render() {
		const {
			props: { pageContent: Content },
			state: { menu },
		} = this;

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
}

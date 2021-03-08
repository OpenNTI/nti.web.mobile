import React from 'react';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';

import { Background } from '@nti/web-commons';
import Page from 'internal/common/components/Page';
import ContextSender from 'internal/common/mixins/ContextSender';

import Header from './Header';

export default createReactClass({
	displayName: 'profile:Page',
	mixins: [ContextSender],

	propTypes: {
		pageContent: PropTypes.any,

		entity: PropTypes.any,
	},

	render() {
		let { entity, pageContent = 'div' } = this.props;

		let Content = pageContent;

		return (
			<Page title="Profile">
				<Background
					className="profile-wrapper"
					imgUrl={entity.backgroundURL}
				>
					<div className="profile">
						<Header entity={entity} />
						<Content {...this.props} />
					</div>
				</Background>
			</Page>
		);
	},
});

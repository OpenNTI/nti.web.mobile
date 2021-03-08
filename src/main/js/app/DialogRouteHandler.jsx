import './DialogRouteHandler.scss';
import React from 'react';
import PropTypes from 'prop-types';

import { Prompt } from '@nti/web-commons';

const { Dialog } = Prompt;

export default class DialogRoute extends React.Component {
	static propTypes = {
		component: PropTypes.any.isRequired,
	};

	render() {
		const { component: Cmp, ...props } = this.props;

		return (
			<Dialog className="mobile-app-dialog-route">
				<Cmp {...props} />
			</Dialog>
		);
	}
}

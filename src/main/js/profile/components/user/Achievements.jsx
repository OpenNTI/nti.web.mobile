import './Achievements.scss';
import React from 'react';
import PropTypes from 'prop-types';

import { User } from '@nti/web-profiles';
export default class extends React.Component {
	static displayName = 'Achievements';

	static propTypes = {
		entity: PropTypes.object.isRequired,
	};

	render() {
		return <User.Achievements entity={this.props.entity} />;
	}
}

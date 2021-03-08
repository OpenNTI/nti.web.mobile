import './View.scss';
import React from 'react';

import { getAppUser } from '@nti/web-client';
import { ProfileUpdate } from '@nti/web-profiles';

export default class LoginUpdatePrompt extends React.Component {
	state = {};

	async componentDidMount() {
		const entity = await getAppUser();

		if (!ProfileUpdate.profileNeedsUpdate(entity)) {
			this.onDismiss();
		}

		this.setState({
			entity,
		});
	}

	onDismiss = () => {
		global.location.replace('/mobile');
	};

	render() {
		const { entity } = this.state;

		if (!entity) {
			return null;
		}

		return (
			<div className="profile-update-container">
				<ProfileUpdate entity={entity} onDismiss={this.onDismiss} />
			</div>
		);
	}
}

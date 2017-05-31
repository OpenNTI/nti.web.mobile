import React from 'react';

import {getService} from 'nti-web-client';

export default class extends React.Component {
    static displayName = 'InvitationCode';

    static propTypes = {
		entity: React.PropTypes.object.isRequired
	};

    componentWillMount() {
		this.getCode();
	}

    selectCode = () => {
		const selection = window.getSelection();
		const range = document.createRange();

		range.selectNodeContents(this.code);
		selection.removeAllRanges();
		selection.addRange(range);
	};

    getCode = () => {
		const {entity} = this.props;
		const link = entity && entity.getLink('default-trivial-invitation-code');

		if (link) {

			getService()
				.then(service => service.get(link))
				.then(result => this.setState({ code: result.invitation_code }));

		}
	};

    render() {
		const {busy, code} = this.state || {};
		if (busy || !code) {
			return null;
		}
		return (
			<div className="invitation-code" onClick={this.selectCode}>
				<label>Invitation Code:</label>
				<span ref={el => this.code = el} className="invitation-code-text">{code}</span>
			</div>
		);
	}
}

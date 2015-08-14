import React from 'react';
import {getService} from 'common/utils';

export default React.createClass({
	displayName: 'InvitationCode',

	propTypes: {
		entity: React.PropTypes.object.isRequired
	},

	getInitialState () {
		return {
		};
	},

	componentWillMount () {
		this.getCode();
	},

	selectCode () {
		let selection = window.getSelection();
		selection.removeAllRanges();
		let range = document.createRange();
		range.selectNodeContents(this.refs.code.getDOMNode());
		selection.addRange(range);
	},

	getCode () {
		let {entity} = this.props;
		let link = entity && entity.getLink('default-trivial-invitation-code');
		if (link) {
			let get = getService().then(service => service.get(link));
			get.then(result => {
				this.setState({
					code: result.invitation_code
				});
				console.debug(result);
			});
		}
	},

	render () {
		let {busy, code} = this.state;
		if (busy || !code) {
			return null;
		}
		return (
			<div className="invitation-code" onClick={this.selectCode}><label>Invitation Code:</label><span ref="code" className="invitation-code-text">{code}</span></div>
		);
	}
});

import React from 'react';

import {scoped} from 'common/locale';
import {getUserAgreementURI} from 'common/utils';

let t = scoped('ENROLLMENT');

export default React.createClass({
	displayName: 'TermsCheckbox',

	propTypes: {
		onChange: React.PropTypes.func
	},

	onChange () {
		if(this.props.onChange) {
			const checked = this.refs.checkbox.checked;
			this.props.onChange(checked);
		}
	},

	render () {
		const url = getUserAgreementURI();
		if (!url) {
			console.error('No user agreement url available. Omitting checkbox');
			return null;
		}

		const html = t('agreeToTerms', {url});
		return (
			<div className="terms-checkbox">
				<label className="terms-label">
					<input type="checkbox" ref="checkbox" onChange={this.onChange} />
					<span dangerouslySetInnerHTML={{__html: html}} />
				</label>
			</div>
		);
	}
});

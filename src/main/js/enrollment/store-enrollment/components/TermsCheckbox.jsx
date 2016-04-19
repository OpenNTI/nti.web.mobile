import React from 'react';

import {scoped} from 'common/locale';
import {getUserAgreementURI} from 'nti-web-client';
import {rawContent} from 'common/utils/jsx';

let t = scoped('ENROLLMENT');

export default React.createClass({
	displayName: 'TermsCheckbox',

	propTypes: {
		onChange: React.PropTypes.func
	},

	onChange () {
		if(this.props.onChange) {
			const checked = this.checkbox.checked;
			this.props.onChange(checked);
		}
	},

	render () {
		const url = getUserAgreementURI();
		if (!url) {
			return null;
		}

		const html = t('agreeToTerms', {url});
		return (
			<div className="terms-checkbox">
				<label className="terms-label">
					<input type="checkbox" ref={x => this.checkbox = x} onChange={this.onChange} />
					<span {...rawContent(html)} />
				</label>
			</div>
		);
	}
});

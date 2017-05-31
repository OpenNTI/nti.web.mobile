import React from 'react';

import {scoped} from 'nti-lib-locale';
import {getUserAgreementURI} from 'nti-web-client';
import {rawContent} from 'nti-commons';

let t = scoped('ENROLLMENT');

export default class extends React.Component {
    static displayName = 'TermsCheckbox';

    static propTypes = {
		onChange: React.PropTypes.func
	};

    onChange = () => {
		if(this.props.onChange) {
			const checked = this.checkbox.checked;
			this.props.onChange(checked);
		}
	};

    render() {
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
}

import './TermsCheckbox.scss';
import React from 'react';
import PropTypes from 'prop-types';
import {scoped} from '@nti/lib-locale';
import {getUserAgreementURI} from '@nti/web-client';
import {rawContent} from '@nti/lib-commons';

const t = scoped('enrollment.terms', {
	agreement: 'I have read and agree to the <a href="%(url)s" target="_blank">licensing terms</a>'
});

export default class TermsCheckbox extends React.Component {

	static propTypes = {
		onChange: PropTypes.func
	};

	attachCheckboxRef = x => this.checkbox = x

	onChange = () => {
		if(this.props.onChange) {
			const checked = this.checkbox.checked;
			this.props.onChange(checked);
		}
	};

	render () {
		const url = getUserAgreementURI();
		if (!url) {
			return null;
		}

		const html = t('agreement', {url});
		return (
			<div className="terms-checkbox">
				<label className="terms-label">
					<input type="checkbox" ref={this.attachCheckboxRef} onChange={this.onChange} />
					<span {...rawContent(html)} />
				</label>
			</div>
		);
	}
}

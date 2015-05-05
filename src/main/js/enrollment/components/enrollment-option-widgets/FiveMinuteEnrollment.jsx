import React from 'react';
import PanelButton from 'common/components/PanelButton';
import {scoped} from 'common/locale';
import BasePathAware from 'common/mixins/BasePath';

const t = scoped('ENROLLMENT');

export default React.createClass({
	displayName: 'FiveMinuteEnrollment',

	mixins: [BasePathAware],

	propTypes: {
		entryId: React.PropTypes.string.isRequired
	},

	statics: {
		re: /fiveminuteenrollmentoption/i, //The server sends lower case M, but we're comparing case-insensitively.
		handles (option) {
			return this.re.test(option && option.MimeType);
		}
	},

	render () {
		let {entryId} = this.props;
		let href = this.getBasePath() + 'catalog/enroll/apply/' + entryId + '/';
		return (
			<PanelButton href={href} linkText={t('fiveMinuteEnrollmentButton')}>
				<h2>{t('fiveMinuteEnrollmentTitle')}</h2>
				<p>{t('fiveMinuteEnrollmentDescription')}</p>
			</PanelButton>
		);
	}

});

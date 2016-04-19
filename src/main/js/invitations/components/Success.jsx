import React from 'react';

import {scoped} from 'common/locale';
import BasePathAware from 'common/mixins/BasePath';

let t = scoped('INVITATIONS');

export default React.createClass({
	displayName: 'Invitations:Success',

	mixins: [BasePathAware],

	render () {
		let library = this.getBasePath() + 'library/';
		return (
			<div className="invitation-success">
				<div className="message">
					<p>{t('successMessage')}</p>
				</div>
				<div className="button-row">
					<a href={library} className="button">{t('successLinkText')}</a>
				</div>
			</div>
		);
	}
});

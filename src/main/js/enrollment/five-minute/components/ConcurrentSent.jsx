import React from 'react';

import {scoped} from 'common/locale';

const t = scoped('ENROLLMENT');

export default React.createClass({
	displayName: 'ConcurrentSent',

	render () {
		return (
			<div className="enrollment-pending">
				<figure className="notice">
					<div>
						<h2>{t('concurrentThanksHead')}</h2>
						<span dangerouslySetInnerHTML={{__html: t('concurrentThanksBody')}} />
					</div>
				</figure>
				<a className="button tiny" href="../../../">Back</a>
			</div>
		);
	}

});

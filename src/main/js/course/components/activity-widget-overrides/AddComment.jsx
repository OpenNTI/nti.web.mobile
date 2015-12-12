import React from 'react';

import {scoped} from 'common/locale';
const t = scoped('ACTIVITY.REPLYABLE');

export default React.createClass({
	displayName: 'AddComment',

	propTypes: {
		item: React.PropTypes.object.isRequired
	},

	render () {
		return (
			<div className="add-comment">
				<a className="placeholder">{t('AddComment')}</a>
			</div>
		);
	}
});

import React from 'react';

import ObjectLink from 'common/mixins/ObjectLink';
import {scoped} from 'common/locale';
const t = scoped('ACTIVITY.REPLYABLE');

export default React.createClass({
	displayName: 'AddComment',
	mixins: [ObjectLink], //temp

	propTypes: {
		item: React.PropTypes.object.isRequired
	},

	render () {
		const {item} = this.props;
		return (
			<div className="add-comment">
				<a href={this.objectLink(item)} className="placeholder">{t('AddComment')}</a>
			</div>
		);
	}
});

import React from 'react';

import createReactClass from 'create-react-class';

import ObjectLink from 'common/mixins/ObjectLink';
import {scoped} from 'nti-lib-locale';
const t = scoped('ACTIVITY.REPLYABLE');

export default createReactClass({
	displayName: 'AddComment',
	mixins: [ObjectLink], //temp

	propTypes: {
		item: React.PropTypes.object.isRequired
	},

	render () {
		const {item} = this.props;
		return (
			<div className="add-comment">
				<a href={this.objectLink(item)} className="placeholder">{t('entryPlaceholder')}</a>
			</div>
		);
	}
});

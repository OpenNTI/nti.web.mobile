import React from 'react';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import {scoped} from 'nti-lib-locale';

import ObjectLink from 'common/mixins/ObjectLink';

const t = scoped('activity.item.replyable', {
	placeholder: 'Add a comment'
});

export default createReactClass({
	displayName: 'AddComment',
	mixins: [ObjectLink], //temp

	propTypes: {
		item: PropTypes.object.isRequired
	},

	render () {
		const {item} = this.props;
		return (
			<div className="add-comment">
				<a href={this.objectLink(item)} className="placeholder">{t('placeholder')}</a>
			</div>
		);
	}
});

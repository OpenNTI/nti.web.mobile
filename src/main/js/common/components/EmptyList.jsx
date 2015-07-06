import React from 'react';
import cx from 'classnames';

import Notice from './Notice';

import {scoped} from '../locale';

const t = scoped('LISTS');

export default React.createClass({
	displayName: 'EmptyList',

	propTypes: {
		type: React.PropTypes.string
	},

	render () {
		let {type} = this.props;
		let message = t('emptyList');
		if (type) {
			message = t('emptyList:' + type);
		}

		return (
			<Notice className={cx('empty-list', type)}>{message}</Notice>
		);
	}

});

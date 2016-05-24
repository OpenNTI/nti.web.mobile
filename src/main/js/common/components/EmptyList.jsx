import React from 'react';
import cx from 'classnames';

import {Notice} from 'nti-web-commons';

import {scoped} from 'nti-lib-locale';

const t = scoped('LISTS');

export default function EmptyList ({type}) {
	let heading;
	let message = t('emptyList');
	if (type) {
		message = t('emptyList:' + type);
	}

	message = message.split('\n');
	if (message.length === 1) {
		[message] = message;
	}
	else {
		[heading, message] = message;
	}

	return (
		<Notice className={cx('empty-list', type)}>
			{heading && ( <h1>{heading}</h1> )}
			{message}
		</Notice>
	);
}
	

EmptyList.propTypes = {
	type: React.PropTypes.string
};

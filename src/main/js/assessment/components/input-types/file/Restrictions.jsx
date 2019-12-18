import React from 'react';
import PropTypes from 'prop-types';
import {List, Utils} from '@nti/web-commons';
import {scoped} from '@nti/lib-locale';
import classnames from 'classnames/bind';

import styles from './Restrictions.css';

const cx = classnames.bind(styles);

const t = scoped('nti-web-mobile.assessment.inputtypes.file.restrictions', {
	maxSize: 'Max File Size',
	extensions: 'Accepted Types',
	mimeTypes: 'Accepted Mime Types',
});

const wildcard = /^[*.]+$/; // test for '*' or '*.*'

const Label = props => <span className={cx('label')} {...props} />;
const Value = props => <span className={cx('value')} {...props} />;

export default function Restrictions ({item}) {
	const {
		max_file_size: maxSize,
		allowed_extensions: allowedExtensions,
		allowed_mime_types: mimes
	} = item || {};

	const mimeTypes = (mimes || []).filter(x => wildcard.test(x)).join(', ');
	const extensions = (allowedExtensions || []).join(', ');

	return (
		<List.Unadorned className={cx('restrictions')}>
			{maxSize && (
				<li>
					<Label>{t('maxSize')}</Label>
					<Value>{Utils.filesize(maxSize)}</Value>
				</li>
			)}
			{extensions && (
				<li>
					<Label>{t('extensions')}</Label>
					<Value>{extensions}</Value>
				</li>
			)}
			{mimeTypes && (
				<li>
					<Label>{t('mimeTypes')}</Label>
					<Value>{mimeTypes}</Value>
				</li>
			)}
		</List.Unadorned>
	);
}

Restrictions.propTypes = {
	item: PropTypes.shape({
		'allowed_extensions': PropTypes.array,
		'allowed_mime_types': PropTypes.array,
		'max_file_size': PropTypes.number,
	})
};

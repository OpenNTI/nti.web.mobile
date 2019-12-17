import React from 'react';
import PropTypes from 'prop-types';
import {AssetIcon, Utils} from '@nti/web-commons';
import classnames from 'classnames/bind';

import styles from './FilePreview.css';

const cx = classnames.bind(styles);

export default function FilePreview ({value}) {
	if (!value) {return null;}

	const {
		FileMimeType: mimeType,
		name,
		filename = name,
		size,
		download_url: href
	} = value;

	const IconWrap = href ? props => <a href={href} download {...props}/> : ({children}) => children;

	return (
		<div className={cx('file-preview')}>
			<div className={cx('file-icon')}>
				<IconWrap><AssetIcon mimeType={mimeType} /></IconWrap>
			</div>
			<div className={cx('info')}>
				<div className={cx('metadata')}>
					<div className={cx('filename')}>{filename}</div>
					{size != null && <div className={cx('file-size')}>({Utils.filesize(size, { round: 1 })})</div>}
				</div>
				<div className={cx('controls')}>
					{href && <a href={href} download className={cx('download')}>Download</a>}
				</div>
			</div>
		</div>
	);
}

FilePreview.propTypes = {
	value: PropTypes.shape({
		FileMimeType: PropTypes.string.isRequired,
		name: PropTypes.string,
		filename: PropTypes.string,
		size: PropTypes.number.isRequired,
		'download_url': PropTypes.string,
	})
};

import React from 'react';
import PropTypes from 'prop-types';
import { AssetIcon, Utils } from '@nti/web-commons';
import classnames from 'classnames/bind';

import styles from './FilePreview.css';

const cx = classnames.bind(styles);

export default function FilePreview({ value, onChange, onClear }) {
	if (!value) {
		return null;
	}

	const {
		FileMimeType: mimeType,
		name,
		filename = name,
		size,
		download_url: href,
	} = value;

	const IconWrap = href
		? props => <a href={href} download {...props} />
		: ({ children }) => children;

	return (
		<div className={cx('file-preview')}>
			<div className={cx('file-icon')}>
				<IconWrap>
					<AssetIcon mimeType={mimeType} />
				</IconWrap>
			</div>
			<div className={cx('info')}>
				<div className={cx('metadata')}>
					<div className={cx('filename')}>{filename}</div>
					{size != null && (
						<div className={cx('file-size')}>
							({Utils.filesize(size, { round: 1 })})
						</div>
					)}
				</div>
				<div className={cx('controls')}>
					{href && (
						<a href={href} download className={cx('download')}>
							Download
						</a>
					)}
					{onChange && (
						<button
							className={cx('change-button')}
							onClick={onChange}
						>
							Change
						</button>
					)}
					{onClear && (
						<i
							className={cx('icon-bold-x', 'clear-button')}
							onClick={onClear}
						/>
					)}
				</div>
			</div>
		</div>
	);
}

FilePreview.propTypes = {
	onChange: PropTypes.func,
	onClear: PropTypes.func,
	value: PropTypes.shape({
		FileMimeType: PropTypes.string,
		name: PropTypes.string,
		filename: PropTypes.string,
		size: PropTypes.number.isRequired,
		download_url: PropTypes.string,
	}),
};

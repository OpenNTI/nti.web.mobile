import React from 'react';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import { Input } from '@nti/web-commons';
import classnames from 'classnames/bind';

import InputType, {stopEvent} from '../Mixin';

import Preview from './FilePreview';
import styles from './File.css';

const cx = classnames.bind(styles);

/**
 * This input type represents File upload
 */
export default createReactClass({
	displayName: 'File',
	mixins: [InputType],

	statics: {
		inputType: [
			'File'
		]
	},

	propTypes: {
		item: PropTypes.object
	},

	getFileReader () {
		if (!this.fileReader) {
			const fr = this.fileReader = new FileReader();
			fr.onload = this.onFileLoaded;
			fr.onloadend = this.onFileLoadEnd;
			fr.onprogress = this.onFileProgress;
			fr.onloadstart = this.onFileLoadStart;
		}
		return this.fileReader;
	},

	onFileLoaded (e) {
		// console.log(this.getFileReader().result);
		this.setState({
			value: {
				...(this.state.value || {}), // mimetype, filename
				value: this.getFileReader().result
			}
		});

		this.handleInteraction();
	},

	// onFileLoadEnd (e) {
	// 	console.log(e);
	// },

	// onFileProgress (e) {
	// 	console.log(e);
	// },

	onFileChange (file) {
		const value = !file ? null : {
			MimeType: 'application/vnd.nextthought.assessment.uploadedfile',
			filename: file.filename || file.name,
			FileMimeType: file.type,
			size: file.size,
			value: null
		};

		this.setState({value}, this.handleInteraction);

		if (file) {
			const reader = this.getFileReader();
			reader.readAsDataURL(file);
		}
	},

	checkFileValidity (file) {
		const {item} = this.props;
		const errs = item?.validateFile?.(file);
		this.setState({errs});
		return !errs || errs.length === 0;
	},

	attachRef (x) { this.fileInput = x; },

	changeFile (e) {
		stopEvent(e);
		this.fileInput?.input?.click();
	},

	clearFile (e) {
		stopEvent(e);
		this.fileInput?.clearFile();
	},

	render () {
		const {valid, value} = this.state;
		const message = valid === false ? 'Unacceptable file chosen.' : null;
		const readOnly = this.isSubmitted();
		const hasValue = !!value;

		return (
			<div className={cx('file-upload')}>
				{!readOnly && (
					<Input.File
						className={cx('file-input', {'with-value': hasValue})}
						ref={this.attachRef}
						onFileChange={this.onFileChange}
						checkValid={this.checkFileValidity}
					/>
				)}
				{message && (
					<div>{message}</div>
				)}
				{value && (
					<Preview
						value={value}
						onClear={readOnly ? null : this.clearFile}
						onChange={readOnly ? null : this.changeFile}
					/>
				)}
			</div>
		);
	},

	getValue () {
		return this.state.value;
	}
});

import React from 'react';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import { Errors, Input } from '@nti/web-commons';
import {scoped} from '@nti/lib-locale';
import classnames from 'classnames/bind';

import InputType, {stopEvent} from '../Mixin';

import Preview from './FilePreview';
import Restrictions from './Restrictions';
import styles from './File.css';

const cx = classnames.bind(styles);

const t = scoped('nti-web-mobile.assessment.inputtypes.file', {
	uploadButton: 'Upload a File'
});

function getSubmissionPartValue (savepoint, item) {
	try {
		const questionSubmission = savepoint.Submission.getQuestion(item.getQuestionId());
		return questionSubmission.getPartValue(item.getPartIndex());
	}
	catch (e) {
		return undefined;
	}
}

/**
 * This input type represents File upload
 */
export default createReactClass({
	displayName: 'File',
	mixins: [InputType],

	statics: {
		inputType: [
			'File'
		],
		containerClass: cx('file-upload-container')
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

	onFileChange (file) {
		const value = !file ? null : {
			MimeType: 'application/vnd.nextthought.assessment.uploadedfile',
			filename: file.filename || file.name,
			...(file.type ? {FileMimeType: file.type} : {}),
			size: file.size,
			value: null
		};

		this.setState({value}, this.handleInteraction);

		if (file) {
			const reader = this.getFileReader();
			reader.readAsDataURL(file);
		}
	},

	onProgressSaved (savepoint, question) {
		const {item} = this.props;
		const submissionPart = getSubmissionPartValue(savepoint, item);
		this.setValue(submissionPart);
		question.setPartValue(item.getPartIndex(), submissionPart);
	},

	checkFileValidity (file) {
		const {item} = this.props;
		// const errs = item?.validateFile?.(file);
		const errs = item.validateFile(file);

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
		const {item} = this.props;
		const {errs, value} = this.state;
		const readOnly = this.isSubmitted();
		const hasValue = !!value;

		return (
			<div className={cx('file-upload')}>
				{!readOnly && (
					<div>
						<Input.File
							className={cx('file-input', {'with-value': hasValue})}
							buttonClass={cx('upload-button')}
							omitFilename
							ref={this.attachRef}
							label={t('uploadButton')}
							onFileChange={this.onFileChange}
							checkValid={this.checkFileValidity}
						/>
						{!value && (
							<Restrictions item={item} />
						)}
					</div>
				)}
				{errs?.length > 0 && (
					<Errors.Message error={errs[0]} />
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

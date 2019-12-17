import React from 'react';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import { isEmpty } from '@nti/lib-commons';
import { Input } from '@nti/web-commons';

import InputType, {stopEvent} from '../Mixin';

import Preview from './FilePreview';

const hasValue = x => x && !isEmpty(x.value);


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
				...(this.state.value || {}),
				value: this.getFileReader().result
			}
		});
			
		this.handleInteraction();
	},

	onFileLoadEnd (e) {
		console.log(e);
	},

	onFileProgress (e) {
		console.log(e);
	},

	onFileChange (file) {
		console.log(file);
		if (!file) {return;}
		this.handleInteraction();


		this.setState({
			value: {
				MimeType: 'application/vnd.nextthought.assessment.uploadedfile',
				filename: file.filename || file.name,
				FileMimeType: file.type,
				value: null
			}
		});

		const reader = this.getFileReader();
		reader.readAsDataURL(file);
	},

	checkFileValidity (file) {
		const {item} = this.props;
		const errs = item?.validateFile?.(file);
		this.setState({errs});
		return errs.length === 0;
	},

	render () {
		const {valid, value} = this.state;
		const message = valid === false ? 'Unacceptable file chosen.' : null;
		const readOnly = this.isSubmitted();

		return (
			<div className="file-upload-form">
				{!readOnly && <Input.File onFileChange={this.onFileChange} checkValid={this.checkFileValidity} />}
				{message && (
					<div>{message}</div>
				)}
				<Preview value={value} />
			</div>
		);
	},


	getValue () {
		return this.state.value;
	}
});

import React from 'react';
import Mixin from './Mixin';

import isEmpty from 'nti.lib.interfaces/utils/isempty';

import ModeledContent from 'modeled-content';

/**
 * This input type represents Modeled Body Content
 */
export default React.createClass({
	displayName: 'ModeledBodyContent',
	mixins: [Mixin],
	saveBuffer: 30000,

	statics: {
		inputType: [
			'ModeledContent'
		]
	},

	render () {
		let {value} = this.state;
		let submitted = this.isSubmitted();

		//Because we return a model in getValue()
		value = this.unwrapValue(value);

		return (
			<form className="modeled content">
				{submitted && (<ModeledContent.Panel body={value}/>)}
				{!submitted && (<ModeledContent.Editor ref="input" value={value}
					onChange={this.handleInteraction}
					onBlur={this.onBlur}
					/>)}
			</form>
		);
	},


	unwrapValue (value) {
		if(value && typeof value === 'object') {
			value = value.value;
		}

		return value;
	},


	onBlur () {
		this.saveProgress();
	},


	getValue () {
		let ref = this.refs.input;
		let value = ref && ref.getValue();

		if (Array.isArray(value) && isEmpty(value.join(''))) {
			return null;
		}

		return isEmpty(value) ? null : {
			MimeType: 'application/vnd.nextthought.assessment.modeledcontentresponse',
			value: value
		};
	}
});

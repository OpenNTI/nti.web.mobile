import React from 'react';
import Mixin, {stopEvent} from './Mixin';

import {Panel, Editor} from 'modeled-content';

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

	shouldComponentUpdate () {
		return this.shouldUpdate;
	},

	render () {
		let {value} = this.state;
		let submitted = this.isSubmitted();

		//Because we return a model in getValue()
		value = this.unwrapValue(value);

		return (
			<form className="modeled content" onSubmit={stopEvent}>
				{submitted && (<Panel body={value}/>)}
				{!submitted && (
					<Editor
						ref={x => this.input = x}
						initialValue={value}
						onChange={this.handleInteraction}
						onBlur={this.onBlur}
						allowInsertImage={false}
						/>
				)}
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
		let ref = this.input;
		let value = ref && ref.getValue();

		if (Array.isArray(value) && Editor.isEmpty(value.join(''))) {
			return null;
		}

		return Editor.isEmpty(value) ? null : {
			MimeType: 'application/vnd.nextthought.assessment.modeledcontentresponse',
			value: value
		};
	}
});

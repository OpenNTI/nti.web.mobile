'use strict';

var React = require('react/addons');
var Mixin = require('./Mixin');

var isEmpty = require('dataserverinterface/utils/isempty');

var ModeledContent = require('modeled-content');

/**
 * This input type represents Modeled Body Content
 */
module.exports = React.createClass({
	displayName: 'ModeledBodyContent',
	mixins: [Mixin],
	saveBuffer: 30000,

	statics: {
		inputType: [
			'ModeledContent'
		]
	},

	render () {
		var {value} = this.state;
		var submitted = this.isSubmitted();

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
		var ref = this.refs.input;
		var value = ref && ref.getValue();

		if (Array.isArray(value) && isEmpty(value.join(''))) {
			return null;
		}

		return isEmpty(value) ? null : {
			MimeType: 'application/vnd.nextthought.assessment.modeledcontentresponse',
			value: value
		};
	}
});

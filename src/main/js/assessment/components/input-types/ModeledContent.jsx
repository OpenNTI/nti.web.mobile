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

	statics: {
		inputType: [
			'ModeledContent'
		]
	},

	render () {
		var value = this.state.value;
		var submitted = this.isSubmitted();

		return (
			<form className="modeled content">
				{submitted && (<ModeledContent.Panel body={value}/>)}
				{!submitted && (<ModeledContent.Editor ref="input" value={value} onChange={this.handleInteraction}/>)}
			</form>
		);
	},


	_processValue (value) {
		if(value && value.hasOwnProperty('value')) {
			value = value.value;
		}
		return value;
	},


	getValue () {
		var ref = this.refs.input;
		var value = ref && ref.getValue();

		return isEmpty(value) ? null : {
			MimeType: 'application/vnd.nextthought.assessment.modeledcontentresponse',
			value: value
		};
	}
});

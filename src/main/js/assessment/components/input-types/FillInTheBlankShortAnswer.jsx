'use strict';

var React = require('react/addons');

var InputType = require('./Mixin');

var Content = require('../Content');

var toArray = require('dataserverinterface/utils/toarray');
var isEmpty = require('dataserverinterface/utils/isempty');
var hasValue = x => x && !isEmpty(x.value);

var strategies = {
	'input[type=blankfield]': x => ({
			name: x.getAttribute('name'),
			maxLength: x.getAttribute('maxlength')
		})
};

/**
 * This input type represents Fill In The Blank - Short Answer
 */
module.exports = React.createClass({
	displayName: 'FillInTheBlankShortAnswer',
	mixins: [InputType],

	statics: {
		inputType: [
			'FillInTheBlankShortAnswer'
		]
	},


	render() {
		return (
			<form ref="form" className="fill-in-the-blank">
				<Content
					content={this.props.item.input}
					strategies={strategies}
					renderCustomWidget={this.renderInput}
					/>
			</form>
		);
	},


	renderInput(tag, props) {
		var {name,maxLength} = props;
		var value = (this.state.value || {})[name];
		return (
			<span className="blank">
				<input ref={name} name={name} value={value} size={maxLength} onChange={this.handleInteraction}/>
			</span>
		);
	},


	getValue: function () {
		var {form} = this.refs;
		if (!form || !this.isMounted()) {return;}

		form = form.getDOMNode();

		var values = null;

		toArray(form.elements).forEach(x =>{
			if (hasValue(x)){
				values = values || {};
				values[x.name] = x.value;
			}
		});

		return values;
	}
});

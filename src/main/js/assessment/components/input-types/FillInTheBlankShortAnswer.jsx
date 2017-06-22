import React from 'react';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import isEmpty from 'isempty';

import Content from '../Content';

import InputType, {stopEvent} from './Mixin';

const hasValue = x => x && !isEmpty(x.value);

const strategies = {
	'input[type=blankfield]': x => ({
		name: x.getAttribute('name'),
		maxLength: x.getAttribute('maxlength')
	})
};

/**
 * This input type represents Fill In The Blank - Short Answer
 */
export default createReactClass({
	displayName: 'FillInTheBlankShortAnswer',
	mixins: [InputType],

	statics: {
		inputType: [
			'FillInTheBlankShortAnswer'
		]
	},


	propTypes: {
		item: PropTypes.object
	},


	attachRef (x) {
		this.form = x;
	},


	componentWillUnmount () {
		delete this.form;
	},


	render () {
		return (
			<form ref={this.attachRef} className="fill-in-the-blank" onSubmit={stopEvent}>
				<Content
					content={this.props.item.input}
					strategies={strategies}
					renderCustomWidget={this.renderInput}
					/>
			</form>
		);
	},


	renderInput (tag, props) {
		let {name, maxLength} = props; //eslint-disable-line react/prop-types
		let value = (this.state.value || {})[name];
		let submitted = this.isSubmitted();

		return (
			<span className="blank">
				<input name={name} value={value} size={maxLength} onChange={this.handleInteraction} readOnly={submitted}/>
			</span>
		);
	},


	getValue () {
		let {form} = this;
		if (!form) { return; }

		let values = null;

		Array.from(form.elements).forEach(x => {
			if (hasValue(x)) {
				values = values || {};
				values[x.name] = x.value;
			}
		});

		return values;
	}
});

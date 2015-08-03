import React from 'react';

import InputType from './Mixin';

import Content from '../Content';

import toArray from 'nti.lib.interfaces/utils/toarray';
import isEmpty from 'nti.lib.interfaces/utils/isempty';

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
export default React.createClass({
	displayName: 'FillInTheBlankShortAnswer',
	mixins: [InputType],

	statics: {
		inputType: [
			'FillInTheBlankShortAnswer'
		]
	},


	propTypes: {
		item: React.PropTypes.object
	},


	render () {
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


	renderInput (tag, props) {
		let {name, maxLength} = props;
		let value = (this.state.value || {})[name];
		let submitted = this.isSubmitted();

		return (
			<span className="blank">
				<input ref={name} name={name} value={value} size={maxLength} onChange={this.handleInteraction} readOnly={submitted}/>
			</span>
		);
	},


	getValue () {
		let {form} = this.refs;
		if (!form || !this.isMounted()) { return; }

		form = React.findDOMNode(form);

		let values = null;

		toArray(form.elements).forEach(x => {
			if (hasValue(x)) {
				values = values || {};
				values[x.name] = x.value;
			}
		});

		return values;
	}
});

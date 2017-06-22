import React from 'react';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import {rawContent} from 'nti-commons';

import Content from '../Content';

import Mixin from './Mixin';


const strategies = {
	'input[type=blankfield]': (x)=>({name: x.getAttribute('name')})
};


/**
 * This solution type represents Fill in the Blank - WordBank
 */
export default createReactClass({
	displayName: 'FillInTheBlankShortAnswerAnswer',
	mixins: [Mixin],

	statics: {
		inputType: [
			'FillInTheBlankShortAnswer'
		]
	},

	propTypes: {
		item: PropTypes.object
	},

	render () {
		let ex = this.state.explanation || '';

		return (
			<div className="fill-in-the-blank solutions">
				<Content
					content={this.props.item.input}
					strategies={strategies}
					renderCustomWidget={this.renderInput}
				/>
				<div className="explanation" {...rawContent(ex)}/>
			</div>
		);
	},


	renderInput (tag, props) {
		let {name} = props;//eslint-disable-line react/prop-types
		let solution = (this.state.solution || {}).value;
		let v = (solution || {})[name];

		if (typeof v === 'object') {
			v = v.solution;
		}

		return (
			<span className="target">
				<span className="blank">{v}</span>
			</span>
		);
	}
});

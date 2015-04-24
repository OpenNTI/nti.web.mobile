import React from 'react';
import Mixin from './Mixin';

import Content from '../Content';

const strategies = {
	'input[type=blankfield]': (x)=>({name: x.getAttribute('name')})
};


/**
 * This solution type represents Fill in the Blank - WordBank
 */
export default React.createClass({
	displayName: 'FillInTheBlankShortAnswerAnswer',
	mixins: [Mixin],

	statics: {
		inputType: [
			'FillInTheBlankShortAnswer'
		]
	},

	propTypes: {
		item: React.PropTypes.object
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
				<div className="explanation" dangerouslySetInnerHTML={{__html: ex}}/>
			</div>
		);
	},


	renderInput (tag, props) {
		let {name} = props;
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

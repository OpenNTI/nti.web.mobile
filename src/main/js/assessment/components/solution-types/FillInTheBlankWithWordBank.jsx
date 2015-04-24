import React from 'react';
import Mixin from './Mixin';

import Content from '../Content';
import WordBankEntry from '../WordBankEntry';

const strategies = {
	'input[type=blankfield]': (x)=>({name: x.getAttribute('name')})
};


/**
 * This solution type represents Fill in the Blank - WordBank
 */
export default React.createClass({
	displayName: 'FillInTheBlankWithWordBankAnswer',
	mixins: [Mixin],

	statics: {
		inputType: [
			'FillInTheBlankWithWordBank'
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
		return (
			<span className="drop target">
				<span className="match blank dropzone" data-dnd>
					{this.renderWordBankEntry(name)}
				</span>
			</span>
		);
	},


	renderWordBankEntry (input) {
		let solution = (this.state.solution || {}).value;
		let wid = (solution || {})[input];
		let {item} = this.props;
		let entry = item.getWordBankEntry(wid);

		if (!entry) {
			return null;
		}

		return <WordBankEntry entry={entry} className="dropped" locked={true}/>;
	}
});

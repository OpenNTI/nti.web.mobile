import React from 'react';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import {rawContent} from 'nti-commons';
import Logger from 'nti-util-logger';

import Content from '../Content';
import WordBankEntry from '../WordBankEntry';

import Mixin from './Mixin';

const logger = Logger.get('assessment:components:solution-types:FillInTheBlankWithWordBank');

const strategies = {
	'input[type=blankfield]': (x)=>({name: x.getAttribute('name')})
};


/**
 * This solution type represents Fill in the Blank - WordBank
 */
export default createReactClass({
	displayName: 'FillInTheBlankWithWordBankAnswer',
	mixins: [Mixin],

	statics: {
		inputType: [
			'FillInTheBlankWithWordBank'
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

		//Only show the first?
		if (Array.isArray(wid)) {
			if (wid.length > 1) {
				logger.warn('Blank has more than one possible solution! Tossing all but the first: %o', wid);
			}
			wid = wid[0];
		}

		let entry = item.getWordBankEntry(wid);
		if (!entry) {
			return null;
		}

		return <WordBankEntry entry={entry} className="dropped" locked/>;
	}
});

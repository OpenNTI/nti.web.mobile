'use strict';

var React = require('react/addons');
var Mixin = require('./Mixin');

var Content = require('../Content');
var WordBankEntry = require('../WordBankEntry');

var strategies = {
	'input[type=blankfield]': (x)=>({name: x.getAttribute('name')})
};


/**
 * This solution type represents Fill in the Blank - WordBank
 */
module.exports = React.createClass({
	displayName: 'FillInTheBlankWithWordBankAnswer',
	mixins: [Mixin],

	statics: {
		inputType: [
			'FillInTheBlankWithWordBank'
		]
	},

	render () {
		var ex = this.state.explanation || '';

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


	renderInput(tag, props) {
		var {name} = props;
		return (
			<span className="drop target">
				<span className="match blank dropzone" data-dnd>
					{this.renderWordBankEntry(name)}
				</span>
			</span>
		);
	},


	renderWordBankEntry(input) {
		var solution = (this.state.solution || {}).value;
		var wid = (solution || {})[input];
		var {item} = this.props;
		var entry = item.getWordBankEntry(wid);

		if (!entry) {
			return null;
		}

		return <WordBankEntry entry={entry} className="dropped" locked={true}/>;
	}
});

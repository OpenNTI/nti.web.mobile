'use strict';

var React = require('react/addons');
var emptyFunction = require('react/lib/emptyFunction');

var InputType = require('./Mixin');

var Content = require('../Content');

var WordBankEntry = require('../WordBankEntry');

var {Mixin, DropTarget} = require('common/dnd');

/**
 * This input type represents Fill In The Blank: With Word Bank
 */
module.exports = React.createClass({
	displayName: 'FillInTheBlankWithWordBank',
	mixins: [InputType],

	statics: {
		inputType: [
			'FillInTheBlankWithWordBank'
		]
	},

	contextTypes: {
		QuestionUniqueDNDToken: React.PropTypes.object
	},

	propTypes: {
		onDrop: React.PropTypes.func
	},


	getDefaultProps: function() {
		return {
			onDrop: emptyFunction
		};
	},


	getInitialState: function() {
		return {
			value: {},
			strategies: {
				'input[type=blankfield]': (x)=>({name: x.getAttribute('name')})
			}
		};
	},


	onDrop: function (drop) {
		var value = Object.assign({}, this.state.value || {});
		var data = drop || {};
		var {source, target} = data;

		if (source) {
			source = source.props['data-source'];
		}

		if (target) {
			target = target.props['data-target'];
		}

		// The ONLY time that the '==' (double equals) operator is acceptable... testing for null
		// (which will evaluate to true for `null` and `undefined` but false for everything else)
		if (target == null || source == null) {
			throw new Error('Illegal State, there must be BOTH a source and a target');
		}

		value[target] = source;
		this.setState({value: value});

		//this.handleInteraction();
	},


	componentWillMount: function() {
		this.setState({
			PartLocalDNDToken: Mixin.getNewCombinationToken(
				Mixin.getNewUniqueToken(),
				this.context.QuestionUniqueDNDToken
			)
		});
	},


	render: function() {
		return (
			<form className="fill-in-the-blank">
				<Content
					content={this.props.item.input}
					strategies={this.state.strategies}
					renderCustomWidget={this.renderInput}
				/>
			</form>
		);
	},


	renderInput: function (tag, props) {
		var {name} = props;
		return (
			<DropTarget accepts={this.state.PartLocalDNDToken}
				tag="span" onDrop={this.onDrop}
				className="drop target" key={name} data-target={name}>
				<span className="match blank dropzone" data-dnd>
					{this.renderWordBankEntry(name)}
				</span>
			</DropTarget>
		);
	},


	renderWordBankEntry: function (input) {
		var wid = this.state.value[input];
		var entry = this.props.item.getWordBankEntry(wid);

		if (!entry) {
			return null;
		}

		return (
			<WordBankEntry entry={entry}/>
		);
	},


	getValue: function () {
		return null;
	}
});

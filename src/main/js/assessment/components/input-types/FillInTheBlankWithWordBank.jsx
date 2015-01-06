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


	getDefaultProps() {
		return {
			onDrop: emptyFunction
		};
	},


	getInitialState() {
		return {
			value: {},
			strategies: {
				'input[type=blankfield]': (x)=>({name: x.getAttribute('name')})
			}
		};
	},


	onDrop(drop) {
		var value = Object.assign({}, this.state.value || {});
		var data = drop || {}, movedFrom;
		var {source, target} = data;

		if (source) {
			movedFrom = source.props['data-dropped-on'];
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
		if (movedFrom) {
			delete value[movedFrom];
		}
		this.setState({value: value});

		//this.handleInteraction();
	},


	onReset(dropId) {
		var v = Object.assign({}, this.state.value);
		delete v[dropId];

		this.setState({value: v});
		//this.handleInteraction();
	},


	componentWillMount() {
		this.setState({
			PartLocalDNDToken: Mixin.getNewCombinationToken(
				Mixin.getNewUniqueToken(),
				this.context.QuestionUniqueDNDToken
			)
		});
	},


	render() {
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


	renderInput(tag, props) {
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


	renderWordBankEntry(input) {
		var wid = this.state.value[input];
		var entry = this.props.item.getWordBankEntry(wid);

		if (!entry) {
			return null;
		}

		return (
			<WordBankEntry entry={entry} className="dropped" data-dropped-on={input}
				onReset={(entry, cmp)=>this.onReset(input, entry, cmp)}/>
		);
	},


	getValue() {
		return null;
	}
});

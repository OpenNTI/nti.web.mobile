import React from 'react';
import emptyFunction from 'react/lib/emptyFunction';

import InputType from './Mixin';

import Content from '../Content';
import Store from '../../Store';

import WordBankEntry from '../WordBankEntry';

import {Mixin, DropTarget} from 'common/dnd';

const strategies = {
	'input[type=blankfield]': x => ({
		name: x.getAttribute('name')
	})
};

/**
 * This input type represents Fill In The Blank: With Word Bank
 */
export default React.createClass({
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
		item: React.PropTypes.object,
		onDrop: React.PropTypes.func
	},


	getDefaultProps () {
		return {
			onDrop: emptyFunction
		};
	},


	getInitialState () {
		return {
			value: null
		};
	},


	onDrop (drop) {
		let value = Object.assign({}, this.state.value || {});
		let data = drop || {}, movedFrom;
		let {source, target} = data;

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

		this.setState({value: value}, this.handleInteraction);
	},


	onReset (dropId) {
		let v = Object.assign({}, this.state.value || {});
		delete v[dropId];

		if (Object.keys(v).length === 0) {
			v = null;
		}

		this.setState({value: v}, this.handleInteraction);
	},


	componentWillMount () {
		this.setState({
			PartLocalDNDToken: Mixin.getNewCombinationToken(
				Mixin.getNewUniqueToken(),
				this.context.QuestionUniqueDNDToken
			)
		});
	},


	render () {
		return (
			<form className="fill-in-the-blank">
				<Content
					content={this.props.item.input}
					strategies={strategies}
					renderCustomWidget={this.renderInput}
				/>
			</form>
		);
	},


	renderInput (tag, props) {
		let {name} = props;
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


	renderWordBankEntry (input) {
		let wid = (this.state.value || {})[input];
		let {item} = this.props;
		let entryItem = item.getWordBankEntry(wid);
		let correct = '';

		if (!entryItem) {
			return null;
		}

		let locked = Store.isSubmitted(item);
		let solution = this.getSolution();
		if (locked && solution && solution.value) {
			solution = solution.value;
			correct = solution[input] === wid ? 'correct' : 'incorrect';
			//console.log(solution[input], input, wid);
		}

		return (
			<WordBankEntry entry={entryItem} className={`dropped ${correct}`} data-dropped-on={input} locked={locked}
				onReset={(entry, cmp)=>this.onReset(input, entry, cmp)}/>
		);
	},


	getValue () {
		return this.state.value;
	}
});

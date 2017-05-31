import PropTypes from 'prop-types';
import React from 'react';

import createReactClass from 'create-react-class';

import InputType, {stopEvent} from './Mixin';

import Content from '../Content';
import Store from '../../Store';

import FillInTheBlankWithWordBankEntry from './FillInTheBlankWithWordBankEntry';

import {Mixin, DropTarget} from 'common/dnd';

const strategies = {
	'input[type=blankfield]': x => ({
		name: x.getAttribute('name')
	})
};

const ensureArray = x => Array.isArray(x) ? x : [x];


/**
 * This input type represents Fill In The Blank: With Word Bank
 */
export default createReactClass({
	displayName: 'FillInTheBlankWithWordBank',
	mixins: [InputType],

	statics: {
		inputType: [
			'FillInTheBlankWithWordBank'
		]
	},

	contextTypes: {
		QuestionUniqueDNDToken: PropTypes.object
	},

	propTypes: {
		item: PropTypes.object,
		onDrop: PropTypes.func
	},


	getDefaultProps () {
		return {
			onDrop: () => {}
		};
	},


	getInitialState () {
		return {
			value: null
		};
	},


	onDrop (drop) {
		const value = Object.assign({}, this.state.value || {});
		const data = drop || {};

		let {source, target} = data;
		let movedFrom;

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
			<form className="fill-in-the-blank" onSubmit={stopEvent}>
				<Content
					content={this.props.item.input}
					strategies={strategies}
					renderCustomWidget={this.renderInput}
				/>
			</form>
		);
	},


	renderInput (tag, props) {
		const {name} = props; //eslint-disable-line react/prop-types
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
		const wid = (this.state.value || {})[input];
		const {item} = this.props;
		const entryItem = item.getWordBankEntry(wid);

		let correct = '';

		if (!entryItem) {
			return null;
		}

		const locked = Store.isSubmitted(item);
		const solution = this.getSolution();
		if (locked && solution && solution.value) {
			const {value: solutionValue} = solution;
			const solutionForInput = ensureArray(solutionValue[input]);
			correct = solutionForInput.includes(wid) ? 'correct' : 'incorrect';
			//console.log(solutionValue[input], input, wid);
		}

		return (
			<FillInTheBlankWithWordBankEntry
				input={input}
				entry={entryItem}
				className={`dropped ${correct}`}
				data-dropped-on={input}
				locked={locked}
				onReset={this.onReset}
			/>
		);
	},


	getValue () {
		return this.state.value;
	}
});

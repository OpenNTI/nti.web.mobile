import React from 'react';
import cx from 'react/lib/cx';

import Content from './Content';
import WordBank from './WordBank';

import Store from '../Store';
import Constants from '../Constants';

import InputTypes from './input-types';
import SolutionTypes from './solution-types';

export default React.createClass({
	displayName: 'Part',

	propTypes: {
		index: React.PropTypes.number.isRequired,
		part: React.PropTypes.object.isRequired,
		viewerIsAdministrative: React.PropTypes.bool
	},


	getInitialState () {
		return {
			helpVisible: false,
			activeHint: -1
		};
	},

	__onStoreChange () {
		let {part} = this.props;
		if (this.isMounted() && this.state.helpVisible && !Store.isSubmitted(part)) {
			this.onCloseHelp();
		}
		this.forceUpdate();
	},


	componentDidMount () {
		Store.addChangeListener(this.__onStoreChange);
	},



	componentWillUnmount () {
		Store.removeChangeListener(this.__onStoreChange);
	},


	componentDidUpdate (prevProps, prevState) {
		if (this.state.helpVisible !== prevState.helpVisible && this.isMounted()) {
			let node = this.refs.container.getDOMNode();
			if (node.getBoundingClientRect().top < 0) {
				node.scrollIntoView();
			}
		}
	},


	onShowSolution (e) {
		if (e) {
			e.preventDefault();
			e.stopPropagation();
		}

		this.setState({
			helpVisible: Constants.HELP_VIEW_SOLUTION,
		});
	},


	onShowHint (e) {
		if (e) {
			e.preventDefault();
			e.stopPropagation();
		}

		let hintCount = (Store.getHints(this.props.part) || []).length;

		this.setState({
			helpVisible: Constants.HELP_VIEW_HINT,
			activeHint: (this.state.activeHint + 1) % hintCount
		});
	},


	onCloseHelp (e) {
		if (e) {
			e.preventDefault();
			e.stopPropagation();
		}

		this.setState({helpVisible:false});
	},


	render () {
		let {part, index, viewerIsAdministrative} = this.props;
		let {content, wordbank} = part || {};
		let {helpVisible} = this.state;

		let css = cx({
			'form-input': 1,
			'hidden': helpVisible,
			'administrative': viewerIsAdministrative
		});


		return (
			<div className="question-part">
				<Content className="part-content" content={content}/>
				{wordbank && (
					<WordBank record={wordbank} disabled={viewerIsAdministrative}/>
				)}
				<div ref="container">
					<div className={css}>
						{InputTypes.select(part, index)}
					</div>
					{
						helpVisible ?
							this.renderHelpView() :
							this.renderHelpButton()
					}
				</div>
			</div>
		);
	},


	renderHelpButton (label) {
		let {part} = this.props;
		let isSubmitted = part && Store.isSubmitted(part);
		let hints = part && Store.getHints(part);
		let solution = part && Store.getSolution(part);
		let handler = null;

		if (this.state.helpVisible) {
			handler = this.onCloseHelp;
		}
		else if (!isSubmitted) {
			if (hints) {
				handler = this.onShowHint;
				label = 'Show Hint';
			}
		}
		//Submitted AND solution...
		else if (solution) {
			handler = this.onShowSolution;
			label = 'Show Solution';
		}

		return !handler ? null : (
			<div className="help-button-box text-right">
				<a href="#" className="help-link" onClick={handler}>{label}</a>
			</div>
		);
	},


	renderHelpView () {
		switch(this.state.helpVisible) {
		//TODO: remove all switch statements, replace with functional object literals. No new switch statements.
			case Constants.HELP_VIEW_HINT:
				return this.renderHint();

			case Constants.HELP_VIEW_SOLUTION:
				return this.renderSolution();

			default: return null;
		}
	},


	renderHint () {
		let part = this.props.part || {};
		let hint = (part.hints || [])[this.state.activeHint];

		return (
			<div className="part-help hint">
				<a href="#" className="close" onClick={this.onCloseHelp}>x</a>
				<div className="hint" dangerouslySetInnerHTML={{__html: hint}}/>
				{this.renderHelpButton('Hide Hint')}
			</div>
		);
	},


	renderSolution () {
		let {index, part} = this.props;

		return (
			<div className="part-help solution">
				<a href="#" className="close" onClick={this.onCloseHelp}>x</a>
				{SolutionTypes.select(part, index)}
				{this.renderHelpButton('Hide Solution')}
			</div>
		);
	}
});

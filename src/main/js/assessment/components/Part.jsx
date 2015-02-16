'use strict';

var React = require('react');

var Content = require('./Content');
var WordBank = require('./WordBank');

var Store = require('../Store');
var Constants = require('../Constants');

var InputTypes = require('./input-types');
var SolutionTypes = require('./solution-types');

module.exports = React.createClass({
	displayName: 'Part',

	propTypes: {
		index: React.PropTypes.number.isRequired,
		part: React.PropTypes.object.isRequired
	},


	getInitialState () {
		return {
			helpVisible: false,
			activeHint: -1
		};
	},

	__onStoreChange () {
		var {part} = this.props;
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
		var node;
		if (this.state.helpVisible !== prevState.helpVisible && this.isMounted()) {
			node = this.refs.container.getDOMNode();
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

		var hintCount = (Store.getHints(this.props.part) || []).length;

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
		var props = this.props;
		var part = props.part || {};
		var index = props.index;
		var isHelpVisible = this.state.helpVisible;

		var inputContainerClass = isHelpVisible ? 'hidden' : '';

		return (
			<div className="question-part">
				<Content className="part-content" content={part.content}/>
				{part.wordbank && (
					<WordBank record={part.wordbank}/>
				)}
				<div ref="container">
					<div className={'form-input ' + inputContainerClass}>
						{InputTypes.select(part, index)}
					</div>
					{
						isHelpVisible ?
							this.renderHelpView() :
							this.renderHelpButton()
					}
				</div>
			</div>
		);
	},


	renderHelpButton (label) {
		var {part} = this.props;
		var isSubmitted = part && Store.isSubmitted(part);
		var hints = part && Store.getHints(part);
		var solution = part && Store.getSolution(part);
		var handler = null;

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
		var part = this.props.part || {};
		var hint = (part.hints || [])[this.state.activeHint];

		return (
			<div className="part-help hint">
				<a href="#" className="close" onClick={this.onCloseHelp}>x</a>
				<div className="hint" dangerouslySetInnerHTML={{__html: hint}}/>
				{this.renderHelpButton('Hide Hint')}
			</div>
		);
	},


	renderSolution () {
		var props = this.props;
		var part = props.part || {};
		var index = props.index;

		return (
			<div className="part-help solution">
				<a href="#" className="close" onClick={this.onCloseHelp}>x</a>
				{SolutionTypes.select(part, index)}
				{this.renderHelpButton('Hide Solution')}
			</div>
		);
	}
});

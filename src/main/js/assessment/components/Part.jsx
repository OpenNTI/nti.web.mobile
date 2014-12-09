/** @jsx React.DOM */
'use strict';

var React = require('react/addons');

var Store = require('../Store');
var Constants = require('../Constants');

var InputTypes = require('./input-types');

module.exports = React.createClass({
	displayName: 'Part',

	propTypes: {
		index: React.PropTypes.number.isRequired,
		part: React.PropTypes.object.isRequired
	},


	getInitialState: function() {
		return {
			helpVisible: false,
			activeHint: -1
		};
	},

	__onStoreChange: function () {
		this.forceUpdate();
	},


	componentDidMount: function() {
		Store.addChangeListener(this.__onStoreChange);
	},



	componentWillUnmount: function() {
		Store.removeChangeListener(this.__onStoreChange);
	},


	onShowSolution: function (e) {
		if (e) {
			e.preventDefault();
			e.stopPropagation();
		}

		this.setState({
			helpVisible: Constants.HELP_VIEW_SOLUTION,
		});
	},


	onShowHint: function (e) {
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


	render: function() {
		var props = this.props;
		var part = props.part || {};
		var index = props.index;
		var isHelpVisible = this.state.helpVisible;

		var inputContainerClass = isHelpVisible ? 'hidden' : '';

		return (
			<div className="question-part">
				<div className="part-content" dangerouslySetInnerHTML={{__html: part.content}}/>
				<div className={inputContainerClass}>{InputTypes.select(part, index)}</div>
				{
					isHelpVisible ?
						this.renderHelpView() :
						this.renderHelpButton()
				}
			</div>
		);
	},


	renderHelpButton: function () {
		var part = this.props.part || {};
		var isSubmitted = Store.isSubmitted(part);

		var hints = Store.getHints(part);
		var solution = Store.getSolution(part);

		if (!isSubmitted) {
			if (hints) {
				return (
					<a href="#" onClick={this.onShowHint}>Show Hint</a>
				);
			}
		}
		//Submitted AND solution...
		else if (solution) {
			return (
				<a href="#" onClick={this.onShowSolution}>Show Solution</a>
			);
		}
	},


	renderHelpView: function () {
		switch(this.state.helpVisible) {
			case Constants.HELP_VIEW_HINT:
				return this.renderHint();

			case Constants.HELP_VIEW_SOLUTION:
				return this.renderSolution();

			default: return null;
		}
	},


	renderHint: function () {
		var part = this.props.part || {};
		var hint = (part.hint || []).getAt(this.state.activeHint);

		return (<div className="hint" dangerouslySetInnerHTML={{__html: hint}}/>);
	},


	renderSolution: function () {

	}
});

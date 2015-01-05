'use strict';

var React = require('react/addons');
var InputType = require('./Mixin');

var Content = require('../Content');

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


	getInitialState: function() {
		return {
			strategies: {
				'input[type=blankfield]': (x)=>({name: x.getAttribute('name')})
			}
		};
	},

	renderInput: function (tag, props) {
		var {name} = props;
		return (
			<DropTarget accepts={this.state.PartLocalDNDToken} tag="span"
				className="drop target" key={name} data-target={name}>
				<span className="match blank dropzone" data-dnd>

				</span>
			</DropTarget>
		);
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


	getValue: function () {
		return null;
	}
});

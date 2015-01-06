'use strict';

var React = require('react/addons');
var emptyFunction = require('react/lib/emptyFunction');
var {PropTypes} = React;
var {Draggable} = require('common/dnd');

var Content = require('./Content');

module.exports = React.createClass({

	contextTypes: {
		QuestionUniqueDNDToken: PropTypes.object.isRequired
	},

	propTypes: {
		entry: PropTypes.object.isRequired,
		className: PropTypes.string
	},

	getDefaultProps () {
		return {
			onReset: emptyFunction,
			className: ''
		};
	},

	onResetClicked (e) {
		if (e) {
			e.preventDefault();
			e.stopPropagation();
		}

		this.props.onReset(this.props.entry, this);
	},

	render () {
		var {content,wid} = this.props.entry;
		var props = Object.assign({}, this.props, {entry: undefined});

		return (
			<Draggable {...props} type={this.context.QuestionUniqueDNDToken} cancel=".reset" data-source={wid}>
				<div className="drag source">
					<a href="#" className="reset" title="Reset" onClick={this.onResetClicked}/>
					<Content content={content}/>
				</div>
			</Draggable>
		);
	}

});

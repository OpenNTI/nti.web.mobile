'use strict';

var React = require('react/addons');
var {PropTypes} = React;
var {Draggable} = require('common/dnd');

var Content = require('./Content');

module.exports = React.createClass({

	contextTypes: {
		QuestionUniqueDNDToken: PropTypes.object.isRequired
	},

	propTypes: {
		entry: PropTypes.object.isRequired
	},

	render: function() {
		var {content,wid} = this.props.entry;
		return (
			<Draggable type={this.context.QuestionUniqueDNDToken} cancel=".reset" data-source={wid}>
				<div className={'drag source'}>
					<a href="#" className="reset" title="Reset"/>
					<Content content={content}/>
				</div>
			</Draggable>
		);
	}

});

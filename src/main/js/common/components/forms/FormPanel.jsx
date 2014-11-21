/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react/addons');
var RenderField = require('./mixins/RenderFieldConfigMixin');

var FormPanel = React.createClass({

	mixins: [RenderField],

	getDefaultProps: function() {
		return {
			noValidate: true,
			styled: true
		};
	},

	render: function() {
		var cssClasses = [];
		var formClasses = '';

		if (this.props.styled) {
			formClasses = 'medium-6 medium-centered columns';
			cssClasses = ['row'];
		}

		if(this.props.busy) {
			cssClasses.push('busy');
		}


		return (
			<div className={cssClasses.join(' ')}>
				<form className={formClasses} onSubmit={this.props.onSubmit} noValidate={this.props.noValidate}>
					<div className="column">
						<h2>{this.props.title}</h2>
						<p>{this.props.subhead}</p>
					</div>
					{this.props.children}
				</form>
			</div>
		);
	}

});

module.exports = FormPanel;

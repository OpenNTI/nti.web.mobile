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
			noValidate: true
		};
	},

	render: function() {

		var cssClasses = ['row'];

		if(this.props.busy) {
			cssClasses.push('busy');
		}

		return (
			<div className={cssClasses.join(' ')}>
				<form className="store-enrollment-form medium-6 medium-centered columns" onSubmit={this.props.onSubmit} noValidate={this.props.noValidate}>
					<div className="column" key="heading">
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

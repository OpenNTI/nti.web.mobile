

import React from 'react';
import RenderField from '../mixins/RenderFormConfigMixin';

export default React.createClass({

	displayName: 'FormPanel',

	mixins: [RenderField],

	propTypes: {
		busy: React.PropTypes.bool,
		children: React.PropTypes.any,
		noValidate: React.PropTypes.bool,
		onSubmit: React.PropTypes.func,
		styled: React.PropTypes.bool,
		subhead: React.PropTypes.string,
		title: React.PropTypes.string
	},

	getDefaultProps: function() {
		return {
			noValidate: true,
			styled: true,
			subhead: null,
			title: null
		};
	},

	render: function() {
		let cssClasses = [];
		let formClasses = '';
		let headingClasses = '';

		if (this.props.styled) {
			headingClasses = 'column';
			formClasses = 'medium-6 medium-centered columns';
			cssClasses = ['row'];
		}

		if(this.props.busy) {
			cssClasses.push('busy');
		}


		return (
			<div className={cssClasses.join(' ')}>
				<form className={formClasses} onSubmit={this.props.onSubmit} noValidate={this.props.noValidate}>
					<div className={headingClasses}>
						{this.props.title && (<h2>{this.props.title}</h2>)}
						{this.props.subhead && (<p>{this.props.subhead}</p>)}
					</div>
					{this.props.children}
				</form>
			</div>
		);
	}

});


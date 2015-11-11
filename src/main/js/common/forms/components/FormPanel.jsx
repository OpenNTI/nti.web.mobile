import React from 'react';
import cx from 'classnames';

import RenderField from '../mixins/RenderFormConfigMixin';

export default React.createClass({

	displayName: 'FormPanel',

	mixins: [RenderField],

	propTypes: {
		busy: React.PropTypes.bool,
		noValidate: React.PropTypes.bool,
		onSubmit: React.PropTypes.func,

		subhead: React.PropTypes.string,
		title: React.PropTypes.string,

		children: React.PropTypes.any,
		className: React.PropTypes.string
	},

	getDefaultProps () {
		return {
			noValidate: true,
			subhead: null,
			title: null
		};
	},

	render () {
		const {props: {children, className, busy, onSubmit, noValidate}} = this;
		const cssClasses = cx('form-panel', className, { busy });

		return (
			<div className={cssClasses}>
				<form onSubmit={onSubmit} noValidate={noValidate}>
					<div className="form-heading">
						{this.props.title && (<h2>{this.props.title}</h2>)}
						{this.props.subhead && (<p>{this.props.subhead}</p>)}
					</div>
					{children}
				</form>
			</div>
		);
	}

});

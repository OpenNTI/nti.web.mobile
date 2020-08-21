import './FormPanel.scss';
import PropTypes from 'prop-types';
import React from 'react';
import cx from 'classnames';

export default class extends React.Component {
	static displayName = 'FormPanel';

	static propTypes = {
		busy: PropTypes.bool,
		noValidate: PropTypes.bool,
		onSubmit: PropTypes.func,

		subhead: PropTypes.string,
		title: PropTypes.string,

		children: PropTypes.any,
		className: PropTypes.string
	};

	static defaultProps = {
		noValidate: true,
		subhead: null,
		title: null
	};

	render () {
		const {props: {children, className, busy, onSubmit, noValidate, title, subhead}} = this;
		const cssClasses = cx('form-panel', className, { busy });

		return (
			<div className={cssClasses}>
				<form onSubmit={onSubmit} noValidate={noValidate}>
					<div className="form-heading">
						{title && (<h2>{title}</h2>)}
						{subhead && (<p>{subhead}</p>)}
					</div>
					{children}
				</form>
			</div>
		);
	}
}

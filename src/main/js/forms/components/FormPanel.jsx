import React from 'react';
import cx from 'classnames';

export default class extends React.Component {
    static displayName = 'FormPanel';

    static propTypes = {
		busy: React.PropTypes.bool,
		noValidate: React.PropTypes.bool,
		onSubmit: React.PropTypes.func,

		subhead: React.PropTypes.string,
		title: React.PropTypes.string,

		children: React.PropTypes.any,
		className: React.PropTypes.string
	};

    static defaultProps = {
        noValidate: true,
        subhead: null,
        title: null
    };

    render() {
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

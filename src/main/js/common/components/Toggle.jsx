import React from 'react';
import cx from 'classnames';

export default React.createClass({
	displayName: 'Toggle',

	propTypes: {
		active: React.PropTypes.string,
		options: React.PropTypes.arrayOf(React.PropTypes.string).isRequired,
		onToggle: React.PropTypes.func.isRequired,

		children: React.PropTypes.any
	},

	onToggle (e) {
		e.preventDefault();
		e.stopPropagation();

		this.props.onToggle(e.target.getAttribute('data-option'));
	},

	render () {
		const {props: {active, options, children}} = this;
		return (
			<div className="toggle-group-container">
				<ul className="toggle-group">
					{options.map(option =>

						<li key={option} className={cx('toggle-option', {'active': option === active})}>
							<a href="#" data-option={option} onClick={this.onToggle}>{option}</a></li>

					)}

					{children}
				</ul>
			</div>
		);
	}
});

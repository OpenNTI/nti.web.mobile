import React from 'react';
import cx from 'classnames';
export default React.createClass({
	displayName: 'OrderingItem',

	propTypes: {
		option: React.PropTypes.object,
		prefix: React.PropTypes.string,
		required: React.PropTypes.bool
	},

	getInitialState () {
		return {};
	},

	validate () {
		let error = this.node.value.trim().length === 0;
		this.setState({
			error
		});
		return !error;
	},

	render () {

		const {option, prefix, required} = this.props;
		const {error} = this.state;
		const classes = cx('odering-item');

		const inputClasses = cx({required, error});

		return (
			<div className={classes}>
				<label>
					<input type="text"
						className={inputClasses}
						pattern="\d*"
						size="3"
						name={`${prefix}${option.label}`}
						onChange={this.validate}
						ref={x => this.node = x}
					/>
					<span>{option.label}</span>
				</label>
			</div>

		);
	}
});

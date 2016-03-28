import React from 'react';
import cx from 'classnames';
export default React.createClass({
	displayName: 'OrderingItem',

	propTypes: {
		option: React.PropTypes.object,
		prefix: React.PropTypes.string
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

		const {option, prefix} = this.props;
		const {error} = this.state;
		const classes = cx('odering-item', {
			error
		});

		return (
			<div className={classes}>
				<label>
					<input type="text"
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

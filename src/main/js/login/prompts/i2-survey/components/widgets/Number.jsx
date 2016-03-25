import React from 'react';
import cx from 'classnames';

import mixin from './mixin';

export default React.createClass({
	displayName: 'Number',

	mixins: [mixin],

	propTypes: {
		element: React.PropTypes.object.isRequired
	},

	getInitialState () {
		return {
		};
	},

	validate () {
		const {element} = this.props;
		if(!element.required) {
			return true;
		}
		let {value = ''} = this.state;
		let error = value.length === 0;
		this.setState({
			error
		});
		return !error;
	},

	onChange (e) {
		this.setState({ value: e.target.value, error: false });
	},

	render () {
		const {element} = this.props;

		if (!element || !this.satisfiesRequirement()) {
			return null;
		}

		const classes = cx('number', 'widget', {
			error: this.state.error,
			required: element.required
		});

		return (
			<div className={classes}>
				<label>{element.label}</label>
				<input type="number" pattern="\d*" name={element.name} onChange={this.onChange} value={this.state.value}/>
			</div>
		);
	}
});

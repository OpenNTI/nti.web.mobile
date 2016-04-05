import React from 'react';
import cx from 'classnames';

import Store from '../../Store';

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
		const value = Store.getValue(element.name) || '';
		let error = value.length === 0;
		this.setState({
			error
		});
		return !error;
	},

	onChange (e) {
		const {element} = this.props;
		Store.setValue(element.name, e.target.value);
		this.setState({
			error: false
		});
	},

	render () {
		const {element} = this.props;
		const {error} = this.state;

		if (!element || !this.satisfiesRequirement()) {
			return null;
		}

		const classes = cx('number', 'widget');

		const inputClasses = cx({
			required: element.required,
			error
		});

		return (
			<div className={classes}>
				{element.label && <p>{element.label}</p>}
				<input type="number"
					className={inputClasses}
					pattern="\d*"
					name={element.name}
					min={element.min}
					max={element.max}
					onChange={this.onChange}
				/>
			</div>
		);
	}
});

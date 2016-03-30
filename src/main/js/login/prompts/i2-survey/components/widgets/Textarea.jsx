import React from 'react';
import cx from 'classnames';

import mixin from './mixin';

export default React.createClass({
	displayName: 'Textarea',

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
		this.setState({
			error: false,
			value: e.target.value
		});
	},

	render () {
		const {element} = this.props;
		const {error} = this.state;

		if (!element || !this.satisfiesRequirement()) {
			return null;
		}

		const classes = cx('textarea', 'widget');

		const inputClasses = cx({
			required: element.required,
			error
		});

		return (
			<div className={classes}>
				<label className="question-label">{element.label}</label>
				<textarea className={inputClasses} name={element.name} onChange={this.onChange}>{this.state.value}</textarea>
			</div>
		);
	}
});

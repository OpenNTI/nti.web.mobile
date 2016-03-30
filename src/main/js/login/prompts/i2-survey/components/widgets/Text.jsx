import React from 'react';
import cx from 'classnames';

import mixin from './mixin';

export default React.createClass({
	displayName: 'Text',

	mixins: [mixin],

	propTypes: {
		element: React.PropTypes.object.isRequired,
		onChange: React.PropTypes.func
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
			value: e.target.value,
			error: false
		});
		if (this.props.onChange) {
			this.props.onChange(e);
		}
	},

	render () {
		const {element} = this.props;
		const {error} = this.state;

		if (!element || !this.satisfiesRequirement()) {
			return null;
		}

		const classes = cx('text', 'widget');

		const inputClasses = cx({
			required: element.required,
			error
		});

		return (
			<div className={classes}>
				{element.label && <p className="question-label">{element.label}</p>}
				<input type="text"
					className={inputClasses}
					readOnly={!!element.readonly}
					name={element.name}
					onChange={this.onChange}
					value={this.state.value}
					defaultValue={element.value}
				/>
			</div>
		);
	}
});

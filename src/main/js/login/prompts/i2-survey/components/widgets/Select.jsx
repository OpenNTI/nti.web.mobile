import React from 'react';
import cx from 'classnames';

import Store from '../../Store';

import SelectOption from './SelectOption';
import mixin, {evaluate} from './mixin';

const optionValue = (option) => option && (option.value || option.label);

export default React.createClass({
	displayName: 'Select',

	mixins: [mixin],

	propTypes: {
		element: React.PropTypes.object.isRequired
	},

	getInitialState () {
		return {};
	},

	onChange (e) {
		const {element} = this.props;
		Store.setValue(element.name, e.target.value);
		this.setState({
			error: false
		});
	},

	validate (updateState = true) {
		const {element} = this.props;
		const value = Store.getValue(element.name) || '';
		const error = element.required && value.length === 0;
		if(updateState) {
			this.setState({
				error
			});
		}
		return !error;
	},

	filteredOptions () {
		const {element} = this.props;
		return element.options.filter(i => evaluate(i.requirement));
	},

	render () {

		const {element} = this.props;
		let {error} = this.state;

		if (!element || !this.satisfiesRequirement()) {
			return null;
		}

		const classes = cx('select', 'widget');

		const filteredOptions = element.options.filter(i => evaluate(i.requirement));

		if (filteredOptions.length === 1) {
			Store.setValue(element.name, optionValue(filteredOptions[0]));
			if(error) {
				error = !this.validate(false);
			}
		}

		const inputClasses = cx({
			required: element.required,
			error
		});

		let selectedValue = Store.getValue(element.name);

		return (
			<div className={classes}>
				<label className="question-label">{element.label}</label>
				<select className={inputClasses} name={element.name} onChange={this.onChange} value={selectedValue}>
					{filteredOptions.length > 1 && <option />}
					{filteredOptions.map((o, i) =>
						<SelectOption key={i} option={o} requirement={o.requirement} selected={element.options.length === 1}/>
					)}
				</select>
			</div>
		);
	}
});

import React from 'react';
import cx from 'classnames';

import SelectOption from './SelectOption';
import mixin, {evaluate} from './mixin';

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
		this.setState({
			value: e.target.value,
			error: false
		});
	},

	validate () {
		const {element} = this.props;
		const {value = ''} = this.state;
		if(element.required && value.length === 0) {
			this.setState({
				error: true
			});
			return false;
		}
		return true;
	},


	render () {

		const {element} = this.props;
		const {error} = this.state;

		if (!element || !this.satisfiesRequirement()) {
			return null;
		}

		const classes = cx('select', 'widget');

		const inputClasses = cx({
			required: element.required,
			error
		});

		return (
			<div className={classes}>
				<label className="question-label">{element.label}</label>
				<select className={inputClasses} name={element.name} onChange={this.onChange} value={this.state.value}>
					<option />
					{element.options.filter(i => evaluate(this.getForm(), i.requirement)).map((o, i) =>
						<SelectOption key={i} option={o} requirement={o.requirement} />
					)}
				</select>
			</div>
		);
	}
});

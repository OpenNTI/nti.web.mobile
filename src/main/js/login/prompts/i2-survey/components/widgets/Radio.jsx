import React from 'react';
import cx from 'classnames';

import Store from '../../Store';

import RadioOption from './RadioOption';
import mixin, {evaluate, optionValue} from './mixin';

export default React.createClass({
	displayName: 'Radio',

	mixins: [mixin],

	propTypes: {
		element: React.PropTypes.object.isRequired
	},

	getInitialState () {
		return {};
	},

	validate () {
		const {element} = this.props;
		if(!element.required) {
			return true;
		}
		if(!this.optionsnode) {
			return true; // component is mounted but renders null due to unsatisfied requirements
		}
		let hasSelected = !!this.optionsnode.querySelector(':checked');
		this.setState({
			error: !hasSelected
		});
		return hasSelected;
	},

	onChange (e) {
		this.validate();
		Store.setValue(e.target.name, e.target.value);
	},

	attachOptionsNode (x) {
		this.optionsnode = x;
	},

	render () {

		const {element} = this.props;

		if (!element || !this.satisfiesRequirement()) {
			return null;
		}

		const classes = cx('radiogroup', 'widget', {
			error: this.state.error,
			required: element.required
		});

		const filteredOptions = element.options.filter(i => evaluate(i.requirement));

		if (filteredOptions.length === 1) {
			Store.setValue(element.name, optionValue(filteredOptions[0]));
		}

		return (
			<div className={classes}>
				<p className="question-label">{element.label}</p>
				<ul className="radio-options" ref={this.attachOptionsNode}>
					{filteredOptions.map((o) => {
						const checked = Store.getValue(element.name) === optionValue(o);
						return (<RadioOption
									key={optionValue(o)}
									option={o}
									name={element.name}
									requirement={o.requirement}
									checked={checked}
									onChange={this.onChange}
								/>);
					})}
				</ul>
			</div>
		);
	}
});

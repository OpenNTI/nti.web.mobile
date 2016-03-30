import React from 'react';
import cx from 'classnames';

import RadioOption from './RadioOption';
import mixin from './mixin';

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

	onChange () {
		this.validate();
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


		return (
			<div className={classes}>
				<p className="question-label">{element.label}</p>
				<ul className="radio-options" ref={this.attachOptionsNode}>
					{element.options.map((o, i) =>
						<RadioOption
							key={i}
							option={o}
							name={element.name}
							requirement={o.requirement}
							onChange={this.onChange}
						/>
					)}
				</ul>
			</div>
		);
	}
});

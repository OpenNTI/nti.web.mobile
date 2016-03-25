import React from 'react';
import cx from 'classnames';

import mixin from './mixin';

export default React.createClass({
	displayName: 'Ordering',

	mixins: [mixin],

	propTypes: {
		element: React.PropTypes.object.isRequired
	},

	getInitialState () {
		return {};
	},

	componentWillMount () {
		this.elements = [];
	},

	validate () {
		let result = true;
		for(let i = 0; i < this.elements.length; i++) {
			let field = this.elements[i];
			if(field.value.trim().length === 0) {
				result = false;
			}
		}
		this.setState({
			error: !result
		});
		return result;
	},

	render () {

		const {element} = this.props;

		if (!element || !this.satisfiesRequirement()) {
			return null;
		}

		const classes = cx('ordering', 'widget', {
			error: this.state.error,
			required: element.required
		});

		return (
			<div className={classes}>
				<div className="question-label">{element.label}</div>
				<ul className="ordering-options">
					{element.options.map((o, i) =>
						<label key={i}>
							<input type="text"
								pattern="\d*"
								size="3"
								key={i}
								name={`${element.name}-${o.label}`}
								ref={x => this.elements[i] = x}
								requirement={o.requirement}
							/>
							<span>{o.label}</span>
						</label>

					)}
				</ul>
			</div>
		);
	}
});

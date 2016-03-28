import React from 'react';
import cx from 'classnames';

import OrderingItem from './OrderingItem';
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
		const {element} = this.props;
		if(!element.required) {
			return true;
		}
		let result = true;
		for(let i = 0; i < this.elements.length; i++) {
			let field = this.elements[i];
			if (!field.validate()) {
				result = false;
			}
		}
		return result;
	},

	render () {

		const {element} = this.props;

		if (!element || !this.satisfiesRequirement()) {
			return null;
		}

		const classes = cx('ordering', 'widget', {
			required: element.required
		});

		return (
			<div className={classes}>
				<div className="question-label">{element.label}</div>
				<ul className="ordering-options">
					{element.options.map((o, i) =>
						<OrderingItem key={i}
							option={o}
							prefix={`${element.name}:`}
							ref={x => this.elements[i] = x} />
					)}
				</ul>
			</div>
		);
	}
});
